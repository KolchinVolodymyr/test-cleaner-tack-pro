import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Link} from "react-router-dom";
import {Loader} from "../../components/loader";

export const JobListPage = () => {
    const {request} = useHttp();
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const loadMessage = async () => {
        try {
            const response = await request('/job/list', 'GET')
            // message(response.message);
            // console.log('response', response)
            let newArr = [];
            Object.entries(response.job).forEach((key, index)=> {
                newArr.push({
                    id: key,
                    name: `Job ${index+1}`
                })
                setIsLoaded(true);
            })
            setData(newArr);
            // history.push(`/`);
        } catch (e) {console.log(e)}
    };

    // Note: an empty array of dependencies [] means that
    // this useEffect will run once
    // similar to componentDidMount ()
    useEffect(()=> {
        loadMessage();
    }, [])

     const onRemove = async (id)  => {
        try {
            await request('/job/remove', 'DELETE', {id: id});
            // message(response.message);
            loadMessage();
        } catch (e) {console.log(e)}
    }
    if (!isLoaded) {
        return <Loader/>
    }
    if (!data.length) {
        return (
            <p className="center">No job yet !!! </p>
        )
    }
    return(
        <div>
            <h1>
                Job List Page
            </h1>
            <div className="collection">
                Create a new job <Link to={'/job'} className="btn waves-effect waves-light">Add job</Link>
            </div>
            <div className="row">
                {data.map(item => {
                return(
                    <div className="col s12 m6" key={item.id[0]}>
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">{item.name}</span>
                                <ul>
                                    <li>WorksiteID:{item.id[1].worksiteID}</li>
                                    <li>Type: {item.id[1].type}</li>
                                    <li>Hazardous materials: {item.id[1].hazardousMaterials}</li>
                                    <li>Service Fee: {item.id[1].serviceFee}</li>
                                    <li>Start date: {item.id[1].startDate}</li>
                                    <li>End date: {item.id[1].endDate}</li>
                                </ul>
                            </div>
                            <div className="card-action">
                                <Link to={`/job/${item.id[1]._id}/edit`}>Edit</Link>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => onRemove(item.id[1]._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>)
                })}
            </div>
        </div>
    )
}