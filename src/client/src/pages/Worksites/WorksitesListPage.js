import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Link} from "react-router-dom";
import {Loader} from "../../components/loader";
import {useMessage} from "../../hooks/message.hook";

export const WorksitesListPage = () => {
    const {request} = useHttp();
    const message = useMessage();
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const loadMessage = async () => {
        try {
            const response = await request('/worksites/list', 'GET')

            let newArr = [];
            Object.entries(response).forEach((key, index)=> {
                newArr.push({
                    id: key,
                    name: `Worksites ${index+1}`
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
            const response = await request('/worksites/remove', 'DELETE', {id: id});
            message(response.message);
            loadMessage();
        } catch (e) {console.log(e)}
    }
    if (!isLoaded) {
        return <Loader/>
    }
    if (!data.length) {
        return (
            <p className="center">No worksites yet !!! </p>
        )
    }
    return(
        <div>
            <h1>
                Worksites List Page
            </h1>
            <div className="collection">
                Create a new worksites <Link to={'/worksites'} className="btn waves-effect waves-light">Add worksites</Link>
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
                                    <li>Address: {item.id[1].address}</li>
                                    <li>Type: {item.id[1].type}</li>
                                    <li>Status2: {item.id[1].status.toString()}</li>
                                </ul>
                            </div>
                            <div className="card-action">
                                <Link to={`/worksites/${item.id[1]._id}/edit`}>Edit</Link>
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