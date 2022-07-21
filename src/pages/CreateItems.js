import React, {useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCategory, createProduct } from '../store/slices/categories'
import Swal from 'sweetalert2/dist/sweetalert2.min.js'

const CreateItems = () => {
  const dispatch = useDispatch()
  const defaultContentType = 'category'
  const defaultCategoryName = 'Category Name'
  const defaultBgColor = '#1F637A'
  const defaultTextColor = '#FFFFFF'

  const catNameInputRef = useRef()
  const prodNameInputRef = useRef()
  const prodCategoryInputRef = useRef()
  const prodImageInputRef = useRef()

  const { list: categories } = useSelector(state => state.categories)
  
  const [contentType, setContentType] = useState(defaultContentType)
  const [categoryName, setCategoryName] = useState(defaultCategoryName)
  const [bgColor, setBgColor] = useState(defaultBgColor)
  const [textColor, setTextColor] = useState(defaultTextColor)
  const [categorySubmitEnabled, setCategorySubmitEnabled] = useState(true)
  const [displayCategoryLoading, setDisplayCategoryLoading] = useState(false)
  

  const [productName, setProductName] = useState(defaultCategoryName)
  const [prodCategoryId, setProdCategoryId] = useState()
  const [selectedFile, setSelectedFile] = useState()
  const [productSubmitEnabled, setProductSubmitEnabled] = useState(true)
  const [displayProductLoading, setDisplayProductLoading] = useState(false)

  const handleCatNameChange = event => {
    setCategoryName(event.target.value)
  }

  const handleBgColorChange = event => {
    setBgColor(event.target.value)
  }

  const handleTextColorChange = event => {
    setTextColor(event.target.value)
  }

  const handleProdNameChange = event => {
    setProductName(event.target.value)
  }

  const handleChangeForm = event => {
    const isProduct = event.target.checked
    setContentType(isProduct ? 'product' : 'category')
  }

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleCategoryChange = event => {
    setProdCategoryId(event.target.value)
  }

  // Submit the Category Form
  const handleSubmitCat = event => {
    event.preventDefault()
    setCategorySubmitEnabled(false)
    setDisplayCategoryLoading(true)

    dispatch(createCategory({
      name: categoryName,
      bgColor: bgColor,
      textColor: textColor
    
    })).then( res => {
      setCategorySubmitEnabled(true)
      setDisplayCategoryLoading(false)

      if( res?.meta?.requestStatus === 'fulfilled') {

        Swal.fire({
          title: 'Success!',
          text: "The category was created",
          icon: 'success',
          confirmButtonText: 'Nice!'
        }).then(() => {
          resetCategoryForm()
        })
        
      } else {
        const errorMessages = {
          'REPEATED_NAME': 'There is another category with that name, <span className="unbreakable">Please use another value!</span>',
          'DEFAULT': 'The category could not be created, <span className="unbreakable">Please contact support!</span>'
        }

        Swal.fire({
          title: 'Failed!',
          html: `Error, ${errorMessages[res?.payload] ? errorMessages[res?.payload] : errorMessages['DEFAULT']}`,
          icon: 'error',
          confirmButtonText: 'Shoot!'
        })
      }
    })
  }

  // Submit the Product Form
  const handleSubmitProd = event => {
    event.preventDefault()
    setProductSubmitEnabled(false)
    setDisplayProductLoading(true)

    dispatch(createProduct({
      name: productName,
      categoryId: prodCategoryId,
      image: selectedFile
    
    })).then(res => {
      setProductSubmitEnabled(true)
      setDisplayProductLoading(false)

      if( res.meta?.requestStatus === 'fulfilled') {
        Swal.fire({
          title: 'Success!',
          text: "The product was created",
          icon: 'success',
          confirmButtonText: 'Nice!'
        }).then(() => {
          resetProductForm()
        })
        
      } else {
        const errorMessages = {
          'REPEATED_NAME': 'There is another product with that name, <span className="unbreakable">Please use another value!</span>',
          'DEFAULT': 'The product could not be created, <span className="unbreakable">Please contact support!</span>'
        }

        Swal.fire({
          title: 'Failed!',
          html: `Error, ${errorMessages[res.payload] ? errorMessages[res.payload] : errorMessages['DEFAULT']}`,
          icon: 'error',
          confirmButtonText: 'Shoot!'
        })
      }
    })
  }

  const resetCategoryForm = () => {
    catNameInputRef.current.value = ''
    setCategoryName(defaultCategoryName)
    setBgColor(defaultBgColor)
    setTextColor(defaultTextColor)
    setCategorySubmitEnabled(true)
    setDisplayCategoryLoading(false)
  }

  const resetProductForm = () => {
    setProductName('')
    setProdCategoryId('')
    setSelectedFile('')
    prodNameInputRef.current.value = ''
    prodCategoryInputRef.current.value = ''
    prodImageInputRef.current.value = ''
    setProductSubmitEnabled(true)
    setDisplayProductLoading(false)
  }

  return (
    <div className="container-xxl flex-wrap flex-lg-nowrap">
      <nav className="navbar bg-light mt-5 mb-2 px-3">
        <h3 className="my-0 py-0">Create Categories and Products</h3>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5">

            <div className="form-check form-switch custom-form-switch">
              <input className="form-check-input" type="checkbox" value="product" role="switch" id="flexSwitchCheckDefault" onChange={handleChangeForm} />
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {contentType === 'product' && (
                  <span>Category / <b>Product</b></span>
                ) || (
                  <span><b>Category</b> / Product</span>
                )}
              </label>
            </div>
            
            {contentType === 'category' && (
              <form className="card px-5 py-4" onSubmit={handleSubmitCat}>
                <fieldset>
                  <legend>New Category</legend>
                  <div className="mb-3">
                    <label htmlFor="createCategoryName" className="form-label">Category Name</label>
                    <input type="text" className="form-control" id="createCategoryName" ref={catNameInputRef} onChange={handleCatNameChange} required/>
                  </div>
                  <div className="container mb-3">
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-6">
                        <div>
                          <label htmlFor="createCategoryBgColor" className="form-label">Background Color</label>
                          <input 
                            id="createCategoryBgColor"
                            type="color" 
                            className="form-control form-control-color" 
                            value={`${bgColor}`}
                            title="Choose the background color"
                            onChange={handleBgColorChange} />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div>
                          <label htmlFor="createCategoryColor" className="form-label">Title Color</label>
                          <input
                            id="createCategoryColor"  
                            type="color" 
                            className="form-control form-control-color" 
                            value={`${textColor}`} 
                            title="Choose the title color"
                            onChange={handleTextColorChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>Result sample:</div>
                    <div className="d-flex px-3 py-2 justify-content-between align-items-center" style={{height: '46px', backgroundColor:`${bgColor}`}}>
                      <div className="fs-5" style={{color:`${textColor}`}}>{categoryName}</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-5">
                    <button disabled={!categorySubmitEnabled} type="submit" className="btn btn-primary">Create</button>
                  </div>
                  
                  {displayCategoryLoading && (
                    <div className="d-flex justify-content-center pt-4">
                      <div className="spinner-border text-secondary" role="status" style={{width: '2rem', height: '2rem'}}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                </fieldset>
              </form>
            )}

            {contentType === 'product' && (
              <form className="card px-5 py-4" onSubmit={handleSubmitProd}>
                <fieldset>
                  <legend>New Product</legend>
                  
                  <div className="mb-3">
                    <label htmlFor="newProductName" className="form-label">Product Name</label>
                    <input type="text" className="form-control" id="newProductName" ref={prodNameInputRef} onChange={handleProdNameChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newProductCategoryList" className="form-label">Category</label>
                    <select className="form-select" aria-label="Select Category" ref={prodCategoryInputRef} onChange={handleCategoryChange} required>
                      <option defaultValue value="">Select category...</option>
                      {categories.map( (category, index) => {
                        return (<option key={`category-option-${index}`} value={category.id}>{category.name}</option>)
                      })}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Image</label>
                    <input className="form-control" type="file" id="formFile" ref={prodImageInputRef} onChange={handleFileChange} required />
                  </div>
                  
                  <div className="text-center mt-5">
                    <button disabled={!productSubmitEnabled} type="submit" className="btn btn-primary">Create</button>
                  </div>

                  {displayProductLoading && (
                    <div className="d-flex justify-content-center pt-4">
                      <div className="spinner-border text-secondary" role="status" style={{width: '2rem', height: '2rem'}}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                </fieldset>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateItems
