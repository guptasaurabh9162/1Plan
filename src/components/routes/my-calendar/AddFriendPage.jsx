import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate instead of useHistory

function AddFriendPage() {
  const [friendName, setFriendName] = useState('');
  const navigate = useNavigate();  // useNavigate hook for navigation

  const handleAddFriend = () => {
    // Your logic to add a friend
    console.log('Friend added:', friendName);
    navigate('/my-calendar');  // Navigate to another page after adding the friend
  };

  return (
    <div className="add-friend-container">
      <h1>Add a Friend</h1>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        placeholder="Enter friend's name"
      />
      <button onClick={handleAddFriend}>Add Friend</button>
    </div>
  );
}

export default AddFriendPage;
