import React, { useEffect, useState } from 'react';
import '../components/OptimisedJob.css'



const OptimisedJob = () => {
    const baseUrl = 'https://hacker-news.firebaseio.com/v0';

    // State to store job IDs, job details, and displayed jobs count
    const [jobIds, setJobIds] = useState([]);
    const [details, setDetails] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6); // Initialize with 6 jobs visible

    // Fetch job IDs from the API
    const fetchJobIds = async () => {
        try {
            const response = await fetch(`${baseUrl}/jobstories.json`);
            const ids = await response.json();
            setJobIds(ids);  // Update state with job IDs
        } catch (error) {
            console.error("Error fetching job IDs:", error);
        }
    };

    // Fetch details of a single job
    const fetchOneDetail = async (jobId) => {
        try {
            const response = await fetch(`${baseUrl}/item/${jobId}.json`);
            return await response.json();  // Return fetched job detail
        } catch (error) {
            console.error("Error fetching job detail:", error);
            return null;  // Return null in case of an error
        }
    };

    // Fetch details for all jobs in jobIds
    const fetchDetails = async () => {
        try {
            const detailsPromises = jobIds.slice(0, visibleCount).map((jobId) => fetchOneDetail(jobId));  // Fetch only the visible jobs
            const newDetails = await Promise.all(detailsPromises);  // Wait for all promises to resolve

            // Filter out any null results (in case of errors)
            const validDetails = newDetails.filter(detail => detail !== null);

            setDetails(validDetails);  // Update the state with the valid fetched details
        } catch (error) {
            console.error("Error fetching job details:", error);
        }
    };

    // Fetch job IDs when the component mounts
    useEffect(() => {
        fetchJobIds();
    }, []);  // Empty dependency array to run only once on mount

    // Fetch job details after jobIds or visibleCount are updated
    useEffect(() => {
        if (jobIds.length > 0) {
            fetchDetails();
        }
    }, [jobIds, visibleCount]);  // Run whenever jobIds or visibleCount changes

    // Handle "View More" button click
    const handleViewMore = () => {
        setVisibleCount(prevCount => prevCount + 6);  // Increase visible count by 6
    };

    return (
        <div>
            <h1>Job Board</h1>
            <ul>
                {details.map((detail, i) => (
                    <li key={i}>
                       {i+1}  <a href={detail.url} target="_blank" rel="noopener noreferrer">
                           {detail.title}
                        </a>
                    </li>
                ))}
            </ul>
            {visibleCount < jobIds.length && (
                <button onClick={handleViewMore}>View More</button>  // Show button if there are more jobs to load
            )}
        </div>
    );
}

export default OptimisedJob;
