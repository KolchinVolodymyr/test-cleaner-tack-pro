import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";

export const EquipmentAddPage = () => {
    const history = useHistory();
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', storageLocation: '', usageFee: '', status: false
    });

    const handleSubmitCreate = async () => {
        try {
            const response = await request('/equipment', 'POST', {...data})
            message(response.message);
            history.push(`/equipment/list`);
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
                Equipment Page
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
                    Storage location:
                    <input
                        type="text"
                        name="storageLocation"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Usage Fee:
                    <input
                        type="text"
                        name="usageFee"
                        onChange={changeHandler}
                    />
                </label>
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