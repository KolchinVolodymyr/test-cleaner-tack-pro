import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";

export const EquipmentListPage = () => {
    const {request} = useHttp();
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const loadMessage = async () => {
        try {
            const response = await request('/equipment/list', 'GET')
            let newArr = [];
            Object.entries(response.equipment).forEach((key, index)=> {
                newArr.push({
                    id: key,
                    name: `Equipment ${index+1}`
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
            await request('/equipment/remove', 'DELETE', {id: id});
            // message(response.message);
            loadMessage();
        } catch (e) {console.log(e)}
    }

    if (!isLoaded) {
        return <Loader/>
    }
    if (!data.length) {
        return (
            <p className="center">No employees yet !!! </p>
        )
    }
    return(
        <div>
            <h1>
                Equipment List Page
            </h1>
            <div className="collection">
                Create a new equipment <Link to={'/equipment'} className="btn waves-effect waves-light">Add equipment</Link>
            </div>
            <div className="row">
                {data.map(item => {
                return(
                    <div className="col s12 m6" key={item.id[0]}>
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">{item.name}</span>
                                <ul>
                                    <li>Name:{item.id[1].name}</li>
                                    <li>Storage location: {item.id[1].storageLocation}</li>
                                    <li>Usage fee: {item.id[1].usageFee}</li>
                                    <li>Status: {item.id[1].status.toString()}</li>
                                </ul>
                            </div>
                            <div className="card-action">
                                <Link to={`/equipment/${item.id[1]._id}/edit`}>Edit</Link>
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