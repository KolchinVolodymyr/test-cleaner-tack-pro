import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";

export const WorksitesAddPage = () => {
    const history = useHistory();
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', address: '', type: '', status: false, worksitesClient: ''
    });

    const handleSubmitCreate = async () => {
        try {
            const response = await request('/worksites', 'POST', {...data})
            message(response.message);
            history.push(`/worksites/list`);
        } catch (e) {console.log(e)}
    };

    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = event => {
        setData({...data, [event.target.name]: event.target.checked});
    }

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return(
        <div>
            <h1>
                Create Worksites
            </h1>
            <form>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        onChange={changeHandler}
                    />
                </label>
                <label>Choose your option</label>
                <select
                    className="browser-default"
                    defaultValue='Choose your option'
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
                <p>
                    <label>
                        <input
                            type="checkbox"
                            name="status"
                            className="filled-in"
                            checked={data.status}
                            onChange={changeHandlerChecked}
                        />
                        <span>Status</span>
                    </label>
                </p>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmitCreate}
                    disabled={loading}
                >
                    Create
                </button>
            </form>
        </div>
    )
}