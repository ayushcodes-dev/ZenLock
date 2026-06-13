"use client"
import Heading from "./component/heading.jsx"
import Footer from "./component/footer.jsx"
import {
  useState,
  useEffect
} from 'react'
import {
  v4 as uuidv4
} from 'uuid';
export default function Home() {
  const [password,
    setPassword] = useState( {
      siteName: "", userName: "", password: ""
    })
  const [passwordArray,
    setPasswordArray] = useState([])
  const [showPass,
    setShowPass] = useState(false)
  const [readySave,
    setReadySave] = useState(false)
  const [deleteConfirm,
    setDeleteConfirm] = useState( {
      show: false, confirm: false
    })
  const [deletePassId,
    setDeletePassId] = useState("")
  
  // handle change in input
  function handleChange(e) {

    setPassword((pass)=> {
      return ({
        ...pass, [e.target.name]: e.target.value
      })
    })


  }
  // handle inputs
  useEffect(()=> {
    if (password.siteName.length > 3 && password.userName.length > 3 && password.password.length > 3) {
      console.log(password.siteName.length, password.userName.length, password.password.length)
      setReadySave(true)

    } else {
      setReadySave(false)

    }
  },
    [password])

  // add password
  function addPassword() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();


    if (readySave) {
      setPasswordArray([{
        ...password, id: uuidv4(), date, time
      }, ...passwordArray])
      setPassword({
        siteName: "", userName: "", password: ""
      })
    }
  }
  // delete password
  function deletePassword(id) {
    let filterPass = passwordArray.filter((pass)=> {
      return pass.id != id
    })
    setPasswordArray(filterPass)
  }
  // edit password
  function editPassword(e) {
    let filterPass = passwordArray.filter((pass)=> {
      return pass.id === e.currentTarget.dataset.id
    })
    setPassword({
      siteName: filterPass[0].siteName, userName: filterPass[0].userName, password: filterPass[0].password
    })
    deletePassword(e.currentTarget.dataset.id)
  }
  // show password
  function showPassword() {
    setShowPass(!showPass)
  }
  function generatePass(length = 20) {

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]";
    let pass = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      pass += charset[randomIndex];
    }
    setPassword({...password,password:pass});
  };


  // fetching data from localstorage
  useEffect(()=> {
    let pass = JSON.parse(localStorage.getItem("password-manager"))

    if (pass) {
      setPasswordArray(pass)
    }

  }, [])

  // saving password to localstorage
  useEffect(()=> {
    localStorage.setItem("password-manager", JSON.stringify(passwordArray))


  },[passwordArray])




  return (
    <div className="min-h-[100vh] h-auto w-[100vw] bg-[rgba(8,0,36,0.8)] ">
      {
      deleteConfirm.show?(
        <div className="fixed top-[50%] left-[50%] h-auto w-[300px] border-[2px] border-white rounded-md text-white px-[10px] py-[10px] bg-[rgba(0,0,0,0.8)] translate-x-[-50%] translate-y-[-50%] z-[10]">
          <h3 className="lato text-xl mb-[20px] my-[10px] text-red-400 ">Do You Want To Delete This Password </h3>
          <div className="flex text-2xl justify-between nunito">
            <button onClick={()=> {
              setDeletePassId("")
              setDeleteConfirm({ show: false, confirm: false })
            }}>Cancel</button>
            <button className="text-red-400" onClick={()=> {
              deletePassword(deletePassId)
              setDeletePassId("")
              setDeleteConfirm({ show: false, confirm: false })
            }}>Delete</button>
          </div>
        </div>
      ): ""
      }
      <div className="min-h-[calc(100vh-200px)]  w-[100vw] rounded-3xl text-white  text-2xl   gird con pb-[40px]">
        <Heading />
        <br />
      <div className="w-[100%] grid  items-center gap-[15px] relative ">
        <input
        type="text" name="siteName" placeholder="Enter Site URL" className="border-[2px] border-green-500 nunito w-[85%] mx-auto " value={password.siteName} onChange={(e)=> { handleChange(e)

        }}
        />
      <input
      type="text" name="userName" placeholder="Enter User Name" className="border-[2px] border-green-500 nunito w-[85%] mx-auto " value={password.userName} onChange={(e)=> { handleChange(e)

      }}
      />
    <input
    type={showPass?"text": "password"} name="password" placeholder="Enter Password" className="border-[2px] border-green-500 nunito w-[85%] mx-auto passwordInp " value={password.password} onChange={(e)=> { handleChange(e)

    }}
    />
  {(<div className="absolute top-[110px] w-[85%] h-[40px] left-[8%] items-center justify-end flex text-base  px-[5%] pointer-events-none">
    <button className="data-w-20 pointer-events-auto" onClick={()=> { showPassword()}}>
      { !showPass?(<lord-icon
        src="https://cdn.lordicon.com/dicvhxpz.json"
        trigger="hover"
        stroke="bold"
        state="hover-cross"
        colors="primary:#ffffff,secondary:#ffffff"

        style={ {
          width: "30px", height: "30px"
        }}> </lord-icon>): (<lord-icon
        src="https://cdn.lordicon.com/dicvhxpz.json"
        trigger="in"
        delay="0"
        stroke="bold"
        state="in-reveal"
        colors="primary:#ffffff,secondary:#ffffff"
        style={ { width: "30px", height: "30px" }}>
      </lord-icon>)
      }
    </button>



  </div>
  )}
  <div className="flex gap-[10px] w-[85%] mx-auto">
    <button className="bg-blue-800 lato" onClick={()=>{
      generatePass()
    }}>Generate  </button>
    <button className={`bg-green-800 lato ${readySave?"opacity-[1]": "opacity-[0.6]"}`} onClick={()=> {
      addPassword()

    }}>Save </button>
  </div>
</div>

<h3 className="text-white text-xl lato justify-center flex w-full my-[20px] relative ">Your Passwords</h3>
<div className="grid w-full passwordCon  overflow-y-auto gap-[10px]">
  {
  passwordArray.length < 1?(<h2 className="mx-auto lato my-[20px]">No Password Added Yet!</h2>): passwordArray.map((pass)=> {
    return(
      <div className="grid grid grid-cols-[5fr_1fr] rounded-xl px-[10px] py-[10px] pb-[0px] w-[95%] bg-[rgba(145,237,171,0.2)] mx-auto max-h-[180px]" key={pass.id}>

        <p className="text-base opacity-[0.8] nunito break-all whitespace-normal w-[100%]">
          {pass.siteName}
        </p>
        <button className="h-[10px] flex justify-end"
          ><span className="material-symbols-outlined" onClick={()=> {
            navigator.clipboard.writeText(pass.siteName)}}>
            content_copy
          </span></button>
        <p className="text-xl align-center w-[80%] ubuntu">
          {pass.userName}
        </p>
        <button className="h-[10px]"></button>
        <p className="text-xl align-center lato font-extrabold opacity-[0.8]">
          {
          pass.password.replace(/./g, "•")

          }
        </p>
        <button className="h-[10px] flex justify-end"><span className="material-symbols-outlined" onClick={()=> {
          navigator.clipboard.writeText(pass.password)}}>
          content_copy
        </span></button>
        <div className="pb-[5px] text-sm flex flex-col justify-end   opacity-[0.6]">
          {pass.date+" "}  {pass.time}
        </div>
        <div className="flex w-[100%] gap-[10px] mt-[10px] justify-end">
          <button className="" data-id={pass.id} onClick={(e)=> { editPassword(e)}}><lord-icon
            src="https://cdn.lordicon.com/exymduqj.json"
            trigger="click"
            stroke="bold"
            state="hover-line"
            colors="primary:#30c9e8,secondary:#30c9e8"

            style={ { width: "30px" }, { height: "30px" }}>
          </lord-icon></button>
          <button data-id={pass.id} onClick={()=> { setDeleteConfirm({ show: true, confirm: false })
            setDeletePassId(pass.id)
          }}>
            <lord-icon
              src="https://cdn.lordicon.com/jzinekkv.json"
              trigger="hover"
              stroke="bold"
              colors="primary:#e83a30,secondary:#e83a30"
              style={ { width: "30px" }, { height: "30px" }}>
            </lord-icon>
          </button>
        </div>
      </div>
    )
  })
  }

</div>



</div>
<Footer />
</div>
);
}
