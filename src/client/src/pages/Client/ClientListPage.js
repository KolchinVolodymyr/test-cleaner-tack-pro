import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";
import {useMessage} from "../../hooks/message.hook";

export const ClientListPage = () => {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const {request} = useHttp();
    const message = useMessage();
    const loadMessage = async () => {
        try {
            const response = await request('/client/list', 'GET')
            let newArr = [];
            Object.entries(response).forEach((key, index)=> {
                newArr.push({
                    id: key,
                    name: `Client ${index+1}`
                })
                setIsLoaded(true);
            })
            setData(newArr);
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
            const response = await request('/client/remove', 'DELETE', {id: id});
            message(response.message);
            loadMessage();
        } catch (e) {console.log(e)}
    }

    if (!isLoaded) {
        return <Loader/>
    }
    if (!data.length) {
        return (
            <p className="center">No client yet !!! </p>
        )
    }
    return(
        <div>
            <h1>
                Client List Page
            </h1>
            <div className="collection">
                Create a new customer <Link to={'/client'} className="btn waves-effect waves-light">Add client</Link>
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
                                    <li>Primary office address: {item.id[1].address}</li>
                                    <li>Contact phone: {item.id[1].phone}</li>
                                    <li>Contact person: {item.id[1].contactPerson}</li>
                                    <li>Corporate or personal: {item.id[1].client}</li>
                                    <li>Status: {item.id[1].status.toString()}</li>
                                </ul>
                            </div>
                            <div className="card-action">
                                <Link to={`/client/${item.id[1]._id}/edit`}>Edit</Link>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => onRemove(item.id[1]._id)}
                                    value={item.id[1]._id}
                                >
                                    Delete
                                </button>
                                <Link className="btn waves-effect waves-light" to={`/client/${item.id[1]._id}/report`}>Create report</Link>
                            </div>
                        </div>
                    </div>)
                })}
            </div>
        </div>
    )
}