import React, { useState, useEffect } from 'react';
import useEth from "../../contexts/EthContext/useEth";

export default function Greeter() {

    const [submitting, setSubmitting] = useState(false)
    const [name, setName] = useState('')
    const [currentFriend, setCurrentFriend] = useState('')
    const { state: { contract, accounts } } = useEth();

    useEffect(() => {
        if (contract) {
            retrieveFriend()
        }
    }, [contract])

    const handleSubmit = async (event) => {

        event.preventDefault();
        setSubmitting(true)

        try {
            const transaction = await contract
                .methods
                .newGreeting(name)
                .send({ from: accounts[0] })

            console.log("Mining...", transaction);
            setSubmitting(false)
            await retrieveFriend()
        } catch (e) {

        }

    }

    const retrieveFriend = async () => {
        const _currentFriend = await contract.methods.greet().call()
        setCurrentFriend(_currentFriend)
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    return (
        <div className="container">
            <h1>Hello my friend - real one</h1>

            {submitting &&
                <div>Submtting Form...</div>
            }

            <div>
                {currentFriend
                    ? <>My current friend is <strong>{currentFriend}</strong></>
                    : <>I don't have any friend yet...</>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        <p>Enter your next friend</p>
                        <input name="name" onChange={handleNameChange} />
                    </label>
                </fieldset>
                <div className="mt-3">
                    {name && <>Do you want to say hello to <strong>{name}</strong> ?</>}
                    <div>
                        <button type="submit" className="btn btn-primary me-3">Say hello!</button>
                        <button type="button" className="btn btn-secondary me-3" onClick={retrieveFriend}>Retrieve my friend</button>
                    </div>
                </div>
            </form>
        </div>
    )
}