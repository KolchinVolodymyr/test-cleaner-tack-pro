import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";

export const WorksitesEditPage = () => {
    let history = useHistory();
    const ID = useParams().id;
    const {request, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', address: '', phone: '', contactPerson: '', clientID: '', status: ''
    });
    const [currentClientID, setCurrentClientID] = useState(null);
    const [clients, setClients] = useState([]);
    const [count, setCount] = useState(0);

    const fetchClient = useCallback(async () => {
        try {
            const response = await request(`/worksites/${ID}/edit`, 'GET');
            setData(response.worksites);
            setClients(response.clientList);
            setCurrentClientID(response.worksites.clientID);

            const promises = response.worksitesJob.map(async(el) => {
                if(el.status === true) {
                    setCount(count+1)
                }
            })
            await Promise.all(promises);
        } catch (e) {console.log(e)}
    }, [ID, request]);

    useEffect(()=>{
        fetchClient()
    }, []);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = event => {
         if(event.target.checked === true) {
             setData({...data, [event.target.name] : event.target.checked });
         } else {
             if(count === 0){
                 setData({...data, [event.target.name] : event.target.checked });
             } else {
                 message('Worksites with active job cannot be deactivated');
             }
         }
    }

    const PressHandler = async ()  => {
        try {
            const response = await request(`/worksites/${ID}/edit`, 'PUT', {...data, id: ID, currentClientID: currentClientID});
            message(response.message);
            setData(response);
            history.push(`/worksites/list`);
        } catch (e) {console.log(e)}
    }

    return(
        <div>
            <h1>
                Worksites2 Edit Page
            </h1>
            <div className="row">
                <div>
                    <div className="input-field">
                        <input
                            placeholder="Name"
                            name="name"
                            type="text"
                            value={data.name || ""}
                            onChange={changeHandler}
                        />
                        <label className="active" htmlFor="link">Enter the name</label>
                    </div>
                    <div className="input-field">
                        <input
                            name="address"
                            type="text"
                            className="validate"
                            value={data.address || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        <label>Choose your option</label>
                            <select
                                className="browser-default"
                                value={data.type || ""}
                                name="type"
                                onChange={changeHandler}
                            >
                                <option value='Choose your option' disabled>Choose your option</option>
                                <option value='office'>office</option>
                                <option value='residential building'>residential building</option>
                                <option value='personal home'>personal home</option>
                                <option value='individual apartment'>individual apartment</option>
                                <option value='manufacturing'>manufacturing</option>
                                <option value='warehouse'>warehouse</option>
                                <option value='outdoor'>outdoor</option>
                                <option value='field'>field</option>
                                <option value='other'>other</option>
                            </select>
                    </div>
                    <div>
                        <p>
                            <label>
                                <input
                                    type="checkbox"
                                    name="status"
                                    className="filled-in"
                                    checked={data.status || ''}
                                    onChange={changeHandlerChecked}
                                />
                                <span>Status</span>
                            </label>
                        </p>

                    </div>
                        <div>
                            <button
                                className="btn btn-primary"
                                onClick={PressHandler}
                            >
                                Save
                            </button>
                        </div>
                    <div>
                        <label>Choose client</label>
                        <select
                            className="browser-default"
                            value={data.clientID || "Choose your option"}
                            name="clientID"
                            onChange={changeHandler}
                        >
                            <option value='Choose your option' disabled>Choose your option</option>
                            {clients.map(el =>{
                                return (
                                    <option key={el._id} value={el._id}>{el.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}