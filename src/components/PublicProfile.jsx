import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


function PublicProfile({ userId: loggedInUserId }) {
 const { userId } = useParams();
 const [profile, setProfile] = useState(null);
 const [error, setError] = useState('');
 const navigate = useNavigate();


 const handleReportUser = () => {
   navigate(`/report/${userId}`);
 };


 const handleMessageUser = async () => {
   try {
     const res = await axios.post(
       'http://localhost:3001/messages/conversations',
       { with_propel_user_id: userId },
       { withCredentials: true }
     );
     navigate(`/messages/${res.data.conversation_id}`);
   } catch (err) {
     setError('Failed to start conversation. Please try again.');
   }
 };


 // Updated useEffect for fetching public profile
 useEffect(() => {
   (async () => {
     try {
       const { data } = await axios.get(
         `http://localhost:3001/users/public_profile/${userId}`,
         { withCredentials: true }
       );
       setProfile(data);
     } catch (err) {
       setError('Failed to load profile.');
       console.error('Error loading profile:', err);
     }
   })();
 }, [userId]);


 if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
 if (!profile) return <p className="text-gray-400 text-center mt-4">Loading...</p>;


 return (
   <div className="container mx-auto px-4 py-6">
     <div className="bg-gray-800 shadow-md rounded-lg p-6">
       <h2 className="text-2xl font-bold mb-4 text-gray-200">Public Profile</h2>
       <p className="text-gray-300 mb-2">
         <strong className="text-gray-200">Name:</strong> {profile.name}
       </p>
       <p className="text-gray-300 mb-2">
         <strong className="text-gray-200">Email:</strong> {profile.email}
       </p>
       <p className="text-gray-300 mb-4">
         <strong className="text-gray-200">Contributions:</strong> {profile.contributions}
       </p>
       <div className="flex space-x-4">
         <button
           onClick={handleMessageUser}
           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
         >
           Message
         </button>
         <button
           onClick={handleReportUser}
           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
         >
           Report User
         </button>
       </div>
     </div>
   </div>
 );
}


export default PublicProfile;
