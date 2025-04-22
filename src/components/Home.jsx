import React from "react";
import { withRequiredAuthInfo } from "@propelauth/react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";  // Adjust the path if necessary

function Home(props) {
   return (
      <div className="container mx-auto p-4">
         <h1 className="text-3xl font-bold mb-4">Welcome to Share Notes</h1>
         
         {/* Integrated Search Feature */}
         <SearchBar />

         {/* Quick Links */}
         <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
            <Link to="/user_info" className="block text-blue-500 hover:underline">
               Click Here to see user info
            </Link>
            <Link to="/auth" className="block text-blue-500 hover:underline mt-2">
               Click Here to see authenticated request
            </Link>
            <Link to="/orgs" className="block text-blue-500 hover:underline mt-2">
               Click Here to see org info
            </Link>
         </div>
      </div>
   );
}

export default withRequiredAuthInfo(Home);
