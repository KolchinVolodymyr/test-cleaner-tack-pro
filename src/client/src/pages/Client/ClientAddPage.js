import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";

export const ClientAddPage = () => {
    const history = useHistory();
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', address: '', phone: '', contactPerson: '', client: '', status: false
    });

    const handleSubmitCreate = async () => {
        try {
            const response = await request('/client', 'POST', {...data})
            message(response.message);
            history.push(`/client/list`);
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
    }, [error, message, clearError])

    return(
        <div>
            <h1>
                Create Client
            </h1>
            <form>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        onChange={changeHandler}
                        required
                    />
                </label>
                <label>
                    Primary office address:
                    <input
                        type="text"
                        name="address"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Contact phone:
                    <input
                        type="text"
                        name="phone"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Contact person:
                    <input
                        type="text"
                        name="contactPerson"
                        onChange={changeHandler}
                    />
                </label>
                <label>Corporate or personal?</label>
                <select
                    className="browser-default"
                    defaultValue='Choose your option'
                    name="client"
                    onChange={changeHandler}
                >
                    <option value='Choose your option' disabled>Choose your option</option>
                    <option value='Corporate'>Corporate</option>
                    <option value='Personal'>Personal</option>
                </select>
                <label>Status</label>
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