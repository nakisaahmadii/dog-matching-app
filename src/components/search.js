import React, {useState, useEffect} from "react";
import '../style.css';
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [dogList, setDogList] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [favorites, setFavorites] = useState(new Set());
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState({total : 0, next: null, prev: null});
    const [sortOrder, setSortOrder] = useState('asc');
    const [errorMessage, setErrorMessage] = useState('');
    const [errOccurred, setErrOccurred] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [match, setMatch] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const {user, setUser} = useUser();
    const navigate = useNavigate();
  
    const handleBreedChange = (event) => {
        setSelectedBreed(event.target.value);
        setPage(0);
    }

    const fetchBreeds = async () => {
        try {
            const res = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', { withCredentials: true });
            if(res.status === 200){
                setBreeds(res.data)
            }
        } catch(error) {
            console.error('Error happened while fetching breeds: ', error);
            setErrorMessage('Failed to load breeds!')
        }
    };

   
    const fetchDogDetails = async (dogIdsList) => {
        try {
            const response = await axios.post( 'https://frontend-take-home-service.fetch.com/dogs', dogIdsList, { withCredentials: true });
            if(response.status === 200){
                setDogList(response.data);
            }
        } catch(error){
            console.error('Error happened while fetching dog details: ', error);
            setDogList([]);
        }
    }


    useEffect(() => {
        const fetchDogsData = async() => {
            setDogList([]);
            setIsLoading(true);
            const params = {
                breeds: selectedBreed ? [selectedBreed] : [],
                sort: `breed:${sortOrder}`,
                size: 10,
                from: page * 10
            };

            try{
                const res = await axios.get('https://frontend-take-home-service.fetch.com/dogs/search', {
                    params: params,
                    withCredentials: true
                });

                if(res.status === 200 && res.data.resultIds.length > 0 ){
                    setPageData({  
                        total: res.data?.total,
                        next: res.data?.next,
                        prev: res.data?.prev
                    });
                    setErrOccurred(false);
                   fetchDogDetails(res.data.resultIds)
                }
            } catch( error) {
                console.error('Error happened while fetching dogs data');
                setErrOccurred(true);
            }finally{
                setIsLoading(false);
            }
        }
        fetchDogsData();
    },[selectedBreed, page, sortOrder]);

    const toggleFavorite = (dogId) => {
        setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            if(newFavorites.has(dogId)){
                newFavorites.delete(dogId)
            } else {
                newFavorites.add(dogId)
            }
            return newFavorites;
        });
    };
    useEffect(() => {
        fetchBreeds();    
    },[]);

    const generateMatch = async () => {
        try {
            const response = await axios.post('https://frontend-take-home-service.fetch.com/dogs/match', Array.from(favorites), { withCredentials: true });
            const matchedDog = dogList.find(dog => dog.id === response.data.match);
            console.log("API RESULT for Match", matchedDog)
            setMatch(matchedDog);
            setShowModal(true);
        } catch (error) {
            console.error('Error generating match:', error);
            setErrorMessage('Failed to generate a match! Try again');
        }
    };

    const handleClose = () => setShowModal(false);
   
    const handleLogout = async () => {
        
        try {
            const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, { withCredentials: true });
            if(response.status === 200) {
                setUser(null);
                navigate('/');  
            }
        } catch(error) {
            console.error('Logout Failed: ', error);
            setErrorMessage('Failed to logout!');
        }
    }

    return (
        <div className="search-container">
       
            <div className="logout-container">
                <h1> Welcome, {user}! Start Searching for Dogs</h1>
                <button style={{float: "right"}} onClick={handleLogout} className="logout-btn">
                    Logout <FontAwesomeIcon icon={faSignOutAlt} /> 
                </button>
            </div>        
            

            <div>
                <button className="generate-match-btn" onClick={generateMatch} disabled={favorites.size === 0}>Generate Match  <FontAwesomeIcon icon={farHeart} color="white" /></button>
                <div className="filters">
                    <label style={{fontSize: "larger"}}>Breed:</label>
                    <select value={selectedBreed} onChange={handleBreedChange}>
                        <option value="">All Breeds</option>
                        {breeds.map((breed, index) => (
                            <option key={index} value={breed}> {breed} </option>
                        ))}
                    </select>

                    <button onClick={() => setSortOrder('asc')} disabled={sortOrder === "asc"}>Sort Ascending</button>
                    <button onClick={() => setSortOrder('desc')} disabled={sortOrder === "desc"}>Sort Descending</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                </div>
            </div>
          
           
            {isLoading ? (
                <div className="loading-container"> 
                    Loading   <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                 </div>) 
            : <>
                {dogList.length > 0  &&
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Zip Code</th>
                                    <th>Breed</th>
                                    <th>Favorite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dogList.map(dog => (
                                    <tr key={dog.id}>
                                        <td><img src={dog.img} alt={dog.name} style={{ width: "100px", height: "auto" }}/></td>
                                        <td>{dog.name}</td>
                                        <td>{dog.age}</td>
                                        <td>{dog.zip_code}</td>
                                        <td>{dog.breed}</td>
                                        <td>
                                        <button onClick={() => toggleFavorite(dog.id)} className="favorite-button">
                                            <FontAwesomeIcon icon={favorites.has(dog.id) ? fasHeart : farHeart} size="lg" />
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    
                        <div className="pagination">
                            <button 
                                style={{marginRight:'10px', borderRadius: '5px'}}
                                onClick={() => setPage(Math.max(0, page -1))} 
                                disabled={page === 0}>Previous
                            </button>

                            <button 
                                style={{marginLeft:'10px', borderRadius: '5px'}} 
                                onClick={() => setPage(page+1)}
                                disabled={!pageData.next}>Next
                            </button>
                        </div>
                    </> }
                    { (dogList.length === 0 && errOccurred) && <div className="error-container">
                        <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Failed to Load Dogs Information!</h3> 
                    </div>}
                
                </>
            }

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Matched Dog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {console.log("Here is the match", match)}
                {match && (
                    <>
                    <p>{match.name} - {match.breed}, {match.age} years old</p>
                    <img src={match.img} alt={match.name} className="fixed-size-image"/>
                    </>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}