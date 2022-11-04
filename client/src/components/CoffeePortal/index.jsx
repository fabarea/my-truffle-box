import { useEffect, useState } from 'react'
import Web3 from 'web3'
import artifact from '../../contracts/CoffeePortal.json';

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

export default function CoffeePortal() {

    const [account, setAccount] = useState('')
    const [balance, setBalance] = useState(0)
    const [network, setNetwork] = useState(0)
    const [contract, setContract] = useState()
    const [totalCoffee, setTotalCoffee] = useState(0)
    const [allCoffees, setAllCoffees] = useState([])
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {

        async function loadAccountAndContract() {
            // We load the account being connected
            const accounts = await web3.eth.requestAccounts()
            const _account = accounts[0]
            setAccount(_account)

            // We get the network type
            const network = await web3.eth.net.getNetworkType()
            setNetwork(network)

            // We load the balance for the account and format the balance
            const balance = await web3.eth.getBalance(_account)
            setBalance((balance / 1e18).toFixed(4))

            // We connect to the contact
            const networkID = await web3.eth.net.getId();
            const { abi } = artifact;
            try {
                const address = artifact.networks[networkID].address
                const contract = new web3.eth.Contract(abi, address);
                setContract(contract)
            } catch (err) {
                console.error(err);
            }
        }

        loadAccountAndContract()

    }, [])

    useEffect(() => {
        if (contract) {
            getTotalCoffee()
            getAllCoffees()
        }
    }, [contract])

    const getTotalCoffee = async () => {
        const totalCoffee = await contract.methods.getTotalCoffee().call()
        setTotalCoffee(totalCoffee)
    }

    const getAllCoffees = async () => {
        const allCoffees = await contract.methods.getAllCoffee().call()
        setAllCoffees(allCoffees)
    }

    const handleSubmit = async (event) => {

        event.preventDefault()
        setSubmitting(true)

        try {
            const transaction = await contract
                .methods
                .buyCoffee(
                    message.trim(),
                    name.trim(),
                    Web3.utils.toWei('0.001', 'ether')
                )
                .send({ from: account })

            console.log("Mining...", transaction);
            setSubmitting(false)
            await getAllCoffees()
        } catch (e) {

        }
    }

    const handleOnNameChange = (event) => {
        setName(event.target.value)
    }

    const handleOnMessageChange = (event) => {
        setMessage(event.target.value)
    }

    return (
        <div className="container">

            <ul>
                <li><strong>My account:</strong> {account}</li>
                <li><strong>Network:</strong> {network}</li>
                <li><strong>Balance:</strong> {balance}</li>
            </ul>

            <div>
                {totalCoffee > 0
                    ? <>Thanks I got {totalCoffee} coffee(s)</>
                    : <>I am thirsty, please give me something!</>
                }
            </div>

            <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="my-name" className="form-label">My name</label>
                    <input className="form-control" id="my-name" placeholder="What's your name?" onChange={handleOnNameChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="my-message" className="form-label">My message</label>
                    <textarea className="form-control" id="my-message" placeholder="Write something nice..." rows="3" onChange={handleOnMessageChange}></textarea>
                </div>
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-3">Buy me this coffee!</button>
                </div>
            </form>

            {submitting &&
                <div>Submtting Form...</div>
            }

            <div className='mt-2'>
                <button className='btn btn-primary me-2' onClick={getTotalCoffee}>Fetch number of coffee</button>
                <button className='btn btn-primary' onClick={getAllCoffees}>get all coffees</button>
            </div>

            <hr />

            <ol className="list-group list-group-numbered">
                {allCoffees.map((coffee, index) => {
                    return (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{coffee.name}</div>
                                <div>{coffee.message}</div>
                                <div>{coffee.giver}</div>
                            </div>
                        </li>
                    )
                })}
            </ol>

        </div>
    )
}