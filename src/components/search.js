import React, { useState, useEffect } from "react";
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
    //State for list of dogs and breeds fetched from API
    const [dogList, setDogList] = useState([]);
    const [breeds, setBreeds] = useState([]);
    //State for managing filters and sorts
    const [selectedBreed, setSelectedBreed] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [sort, setSort] = useState({ field: 'breed', order: 'asc' });
    //State for managing user's favorite dogs
    const [favorites, setFavorites] = useState(new Set());
    //Pagination state
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState({ total: 0, next: null, prev: null });
    //State for handling loading and errors
    const [errorMessage, setErrorMessage] = useState('');
    const [errOccurred, setErrOccurred] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    //State for adoption match
    const [match, setMatch] = useState(null);
    //State for handling modal
    const [showModal, setShowModal] = useState(false);
    //User context and authentication and navigation through pages
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    //Handles breed selection and setting the page to 0
    const handleBreedChange = (event) => {
        setSelectedBreed(event.target.value);
        setPage(0);
    }

    //Fetching the list of dog breeds
    const fetchBreeds = async () => {
        try {
            const res = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', { withCredentials: true });
            if (res.status === 200) {
                setBreeds(res.data)
            }
        } catch (error) {
            console.error('Error happened while fetching breeds: ', error);
            setErrorMessage('Failed to load breeds!')
        }
    };

    useEffect(() => {
        fetchBreeds();
    }, []);

    //Fetching detailed information for list of dogs
    const fetchDogDetails = async (dogIdsList) => {
        try {
            const response = await axios.post('https://frontend-take-home-service.fetch.com/dogs', dogIdsList, { withCredentials: true });
            if (response.status === 200) {
                setDogList(response.data);
            }
        } catch (error) {
            console.error('Error happened while fetching dog details: ', error);
            setDogList([]);
        }
    }

    //Fetches dogs based on filters, sorting, and pagination
    useEffect(() => {
        const fetchDogsData = async () => {
            setDogList([]);
            setIsLoading(true);
            const params = {
                breeds: selectedBreed ? [selectedBreed] : [],
                zipCodes: zipCode.trim() ? [zipCode] : [],
                ageMin: minAge || undefined,
                ageMax: maxAge || undefined,
                sort: `${sort.field}:${sort.order}`,
                size: 10,
                from: page * 10
            };

            try {
                const res = await axios.get('https://frontend-take-home-service.fetch.com/dogs/search', {
                    params: params,
                    withCredentials: true
                });

                if (res.status === 200 && res.data.resultIds.length > 0) {
                    setPageData({
                        total: res.data?.total,
                        next: res.data?.next,
                        prev: res.data?.prev
                    });
                    setErrOccurred(false);
                    fetchDogDetails(res.data.resultIds);
                }
            } catch (error) {
                console.error('Error happened while fetching dogs data');
                setErrOccurred(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDogsData();
    }, [selectedBreed, page, sort, minAge, maxAge, zipCode]);

    //Add dogs to favorites list
    const toggleFavorite = (dogId) => {
        setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            if (newFavorites.has(dogId)) {
                newFavorites.delete(dogId)
            } else {
                newFavorites.add(dogId)
            }
            return newFavorites;
        });
    };


    //Generate adoption match based on the user's favorites
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

    //Handle closing the matching modal
    const handleClose = () => setShowModal(false);

    //Logout function to clear the user and navigate to login page
    const handleLogout = async () => {
        try {
            const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, { withCredentials: true });
            if (response.status === 200) {
                setUser(null);
                navigate('/dog-matching-app');
            }
        } catch (error) {
            console.error('Logout Failed: ', error);
            setErrorMessage('Failed to logout!');
        }
    }

    return (
        <div className="search-container">
            <div className="logout-container">
                <div>
                    <h1 style={{ width: "100%" }}> Welcome, {user}!</h1> <br />
                    <h2 style={{ display: "block", width: "100%", marginBottom: "30px" }}>Dogs are not our whole life, but they make our lives whole. <span style={{ fontSize: "small" }}>~Roger Caras</span></h2>
                </div>
                <button style={{ float: "right" }} onClick={handleLogout} className="logout-btn">
                    Logout <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
            <div>
                <button
                    className="generate-match-btn"
                    onClick={generateMatch}
                    disabled={favorites.size === 0}> Generate Match  <FontAwesomeIcon icon={farHeart} color="white" />
                </button>
                {/*Filter section */}
                <div className="filters">
                    <label style={{ fontSize: "large" }}>Filter By</label>
                    <select value={selectedBreed} onChange={handleBreedChange}>
                        <option value="">All Breeds</option>
                        {breeds.map((breed, index) => (
                            <option key={index} value={breed}> {breed} </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Zip Code"
                        style={{ width: "auto", padding: "2px 5px", marginBottom: "0px" }}
                        value={zipCode}
                        onChange={e => setZipCode(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Min Age"
                        value={minAge}
                        onChange={e => setMinAge(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max Age"
                        value={maxAge}
                        onChange={e => setMaxAge(e.target.value)}
                    />
                </div>
                {/*Sorting section */}
                <div className="filters" style={{marginBottom: "50px"}}>
                    <label style={{ fontSize: "large" }}>Sort By</label>
                    <select
                        value={sort.field}
                        onChange={e => setSort({ ...sort, field: e.target.value })}
                    >
                        <option value="breed">Breed</option>
                        <option value="age">Age</option>
                        <option value="name">Name</option>
                    </select>
                    <button onClick={() => setSort({ ...sort, order: 'asc' })} disabled={sort.order === "asc"}>Ascending</button>
                    <button onClick={() => setSort({ ...sort, order: 'desc' })} disabled={sort.order === "desc"}>Descending</button>
                    {/*Displaying Errors*/}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
                
            </div>

            {isLoading ? (
                //Display loading while the API is fetching data
                <div className="loading-container">
                    Loading   <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                </div>)
                : <>
                    {dogList.length > 0 &&
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
                                            <td><img src={dog.img} alt={dog.name} style={{ width: "100px", height: "auto" }} /></td>
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
                                    style={{ marginRight: '10px', borderRadius: '5px' }}
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}>Previous
                                </button>
                                <button
                                    style={{ marginLeft: '10px', borderRadius: '5px' }}
                                    onClick={() => setPage(page + 1)}
                                    disabled={!pageData.next}>Next
                                </button>
                            </div>
                        </>}
                    {(dogList.length === 0 && errOccurred) && <div className="error-container">
                        <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Failed to Load Dogs Information!</h3>
                    </div>}
                </>
            }
            {/* Pop-up modal to show the adoption match */}
            <Modal show={showModal && match} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "red" }}>Adoption Matched </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {match &&
                        <>
                            <p>{match.name} - {match.breed}, {match.age} years old</p>
                            <img src={match.img} alt={match.name} className="fixed-size-image" />
                        </>
                    }
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