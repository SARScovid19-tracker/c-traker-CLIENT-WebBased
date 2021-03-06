import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatients, fetchHospital } from '../store/actions'
import PatientList from '../components/patientList'
import cLogo from '../assets/logo-removebg-preview-trimmed.png'

function Home() {
    const [inputSearch, setInputSearch] = useState("")
    const [resultCategory, setResultCategory] = useState("All")
    const history = useHistory()
    const dispatch = useDispatch()
    const { patientList, loggedInUser } = useSelector((state) => state)
    console.log(loggedInUser, '<<< loggedInAdmin');
    console.log(patientList, '<<< list of their patients');
    const { hospitalId } = useParams()
    
    useEffect(() => {
        if(!localStorage.token) {
            history.push('/login')
        } else {
            dispatch(fetchHospital(hospitalId))
            dispatch(fetchPatients(hospitalId))
        }
    }, [dispatch, history, hospitalId, inputSearch])

    const handleSignOut = () => {
        localStorage.clear() 
        history.push('/login')
    }

    const handleOnChangeSearch = (event) => {
        event.preventDefault()
        setInputSearch(event.target.value)
    }

    const handleOnChangeCategory = (event) => {
        event.preventDefault()
        setResultCategory(event.target.value)
    }

    let filteredPatients = patientList
    if(resultCategory === 'Waiting') {
        filteredPatients = patientList.filter(patient => patient.isWaitingResult && patient.User.status === 'Negative')
    } else if (resultCategory !== 'All') {
        filteredPatients = patientList.filter(patient => patient.User.status === resultCategory && !patient.isWaitingResult)
    }
    if(inputSearch) {
        filteredPatients = patientList.filter(patient => patient.User.phone.includes(inputSearch))
    }


    return (
    <>
    <div className="container mt-3">
        <div>
            <div className="col-12 mb-3 d-flex flex-row-reverse mr-0 pr-0">
                <button onClick={handleSignOut} className="pull-right btn btn-danger btn-sm">Sign out</button>
                <h5 className="pull-left mr-5 pt-2 font-weight-bold" style={{color: "#250747"}}>{loggedInUser}</h5>
            </div>
            <div className="col-12 text-center mb-5 pb-3">
                <img className="w-25" src={cLogo} alt="c-tracker logo" />
            </div>
            <h3 className="mt-3 font-weight-bold">Our Patients
                <span className="float-right row col-3">
                        <input onChange={handleOnChangeSearch} value={inputSearch}
                            className="form-control col-12 pull-right bg-white rounded" 
                            type="search" 
                            placeholder="Search by phone number" aria-label="Search"
                        />
                </span>
                <span className="float-right row col-2 pr-0 mr-3">
                        <select className="col-9 form-control  bg-white rounded" onChange={handleOnChangeCategory}>
                            <option className="col-12" value="All">All</option>
                            <option className="col-12" value="Waiting">Waiting</option>
                            <option className="col-12" value="Negative">Negative</option>
                            <option className="col-12" value="Positive">Positive</option>
                        </select>
                </span>
            </h3>
        </div>
        <div className="justify-content-center mt-5 shadow bg-white rounded tableFixedHead" style={{ overflowY: "scroll",  height: "425px"}}>
            <table className="table table-striped table-borderless mb-0">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Test Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Result</th>
                    <th scope="col">Published Date</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                    { filteredPatients.map((patient, index) => {
                        return (
                            <PatientList patient={patient} index={index} key={patient.id}/>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
    </>
    )
}

export default Home