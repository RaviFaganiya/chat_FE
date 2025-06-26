// // import React, { useState } from 'react';
// // import axios from 'axios';

// // function CreateAccount() {
// //     const [step, setStep] = useState(1);
// //     const [email, setEmail] = useState('');
// //     const [userOtp, setUserOtp] = useState('');
// //     const [name, setName] = useState('');

// //     const handleSendOtp = async () => {
// //         if (!email) return alert('Please enter your email');

// //         try {
// //             const response = await axios.post(
// //                 'http://localhost:5500/api/auth/send-otp',
// //                 { email }, // Body
// //                 {
// //                     headers: {
// //                         'Content-Type': 'application/json',
// //                         Accept: 'application/json',
// //                     },
// //                 }
// //             );

// //             console.log('OTP sent response:', response.data);
// //             setStep(2);
// //         } catch (err) {
// //             console.error('Error sending OTP:', err.response?.data || err.message);
// //             alert('Failed to send OTP ❌');
// //         }
// //     };

// //     const handleVerifyOtp = async () => {
// //         try {
// //             const res = await axios.post('http://localhost:5500/api/auth/verify-otp', {
// //                 email,
// //                 otp: userOtp,
// //             });

// //             const token = res.data.token;
// //             if (token) {
// //                 localStorage.setItem('token', token);
// //                 alert('OTP Verified ✅');
// //                 setStep(3);
// //             } else {
// //                 alert('Invalid OTP or token missing ❌');
// //             }
// //         } catch (err) {
// //             console.error(err);
// //             alert('OTP verification failed ❌');
// //         }
// //     };

// //     const handleSubmit = async () => {
// //         const token = localStorage.getItem('token');

// //         if (!token) {
// //             return alert('No token found. Please verify OTP again.');
// //         }

// //         try {
// //             await axios.post(
// //                 'http://localhost:5500/api/user/create-user',
// //                 { name },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                     },
// //                 }
// //             );
// //             alert(`Account created for ${name} 🎉`);
// //         } catch (err) {
// //             console.error(err);
// //             alert('Failed to create user ❌');
// //         }
// //     };

// //     return (
// //         <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl bg-white space-y-6">
// //             <h2 className="text-2xl font-bold text-center text-blue-600">Create Account</h2>

// //             {step === 1 && (
// //                 <div className="space-y-4">
// //                     <input
// //                         type="email"
// //                         placeholder="Enter your email"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />
// //                     <button
// //                         onClick={handleSendOtp}
// //                         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
// //                     >
// //                         Send OTP
// //                     </button>
// //                 </div>
// //             )}

// //             {step === 2 && (
// //                 <div className="space-y-4">
// //                     <input
// //                         type="text"
// //                         placeholder="Enter OTP"
// //                         value={userOtp}
// //                         onChange={(e) => setUserOtp(e.target.value)}
// //                         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //                     />
// //                     <button
// //                         onClick={handleVerifyOtp}
// //                         className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
// //                     >
// //                         Verify OTP
// //                     </button>
// //                 </div>
// //             )}

// //             {step === 3 && (
// //                 <div className="space-y-4">
// //                     <input
// //                         type="text"
// //                         placeholder="Enter your name"
// //                         value={name}
// //                         onChange={(e) => setName(e.target.value)}
// //                         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
// //                     />
// //                     <button
// //                         onClick={handleSubmit}
// //                         className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
// //                     >
// //                         Submit
// //                     </button>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// // export default CreateAccount;
// // import React, { useState } from 'react';
// // import axios from 'axios';

// // function CreateAccount({ setIsCreateAccount }) {
// //   const [step, setStep] = useState(1);
// //   const [email, setEmail] = useState('');
// //   const [userOtp, setUserOtp] = useState('');
// //   const [name, setName] = useState('');

// //   const handleSendOtp = async () => {
// //     if (!email) return alert('Please enter your email');

// //     try {
// //       const response = await axios.post(
// //         'http://localhost:5500/api/auth/send-otp',
// //         { email },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Accept: 'application/json',
// //           },
// //         }
// //       );

// //       console.log('OTP sent response:', response.data);
// //       alert('OTP sent to your email ✅');
// //       setStep(2);
// //     } catch (err) {
// //       console.error('Error sending OTP:', err.response?.data || err.message);
// //       alert('Failed to send OTP ❌');
// //     }
// //   };

// //   const handleVerifyOtp = async () => {
// //     if (!userOtp) return alert('Please enter OTP');

// //     try {
// //       const res = await axios.post('http://localhost:5500/api/auth/verify-otp', {
// //         email,
// //         otp: userOtp,
// //       });

// //       const token = res.data.token;
// //       if (token) {
// //         localStorage.setItem('token', token);
// //         alert('OTP Verified ✅');
// //         setStep(3);
// //       } else {
// //         alert('Invalid OTP or token missing ❌');
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert('OTP verification failed ❌');
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     const token = localStorage.getItem('token');

// //     if (!token) {
// //       return alert('No token found. Please verify OTP again.');
// //     }

// //     try {
// //       await axios.post(
// //         'http://localhost:5500/api/user/create-user',
// //         { name },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       alert(`Account created for ${name} 🎉`);
// //       setIsCreateAccount(true); // 👉 redirect to ChatNavigator
// //     } catch (err) {
// //       console.error(err);
// //       alert('Failed to create user ❌');
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl bg-white space-y-6">
// //       <h2 className="text-2xl font-bold text-center text-blue-600">Create Account</h2>

// //       {step === 1 && (
// //         <div className="space-y-4">
// //           <input
// //             type="email"
// //             placeholder="Enter your email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //           <button
// //             onClick={handleSendOtp}
// //             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
// //           >
// //             Send OTP
// //           </button>
// //         </div>
// //       )}

// //       {step === 2 && (
// //         <div className="space-y-4">
// //           <input
// //             type="text"
// //             placeholder="Enter OTP"
// //             value={userOtp}
// //             onChange={(e) => setUserOtp(e.target.value)}
// //             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //           />
// //           <button
// //             onClick={handleVerifyOtp}
// //             className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
// //           >
// //             Verify OTP
// //           </button>
// //         </div>
// //       )}

// //       {step === 3 && (
// //         <div className="space-y-4">
// //           <input
// //             type="text"
// //             placeholder="Enter your name"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
// //           />
// //           <button
// //             onClick={handleSubmit}
// //             className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
// //           >
// //             Submit
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default CreateAccount;
// import React, { useState } from 'react';
// import axios from 'axios';

// function CreateAccount({ setIsCreateAccount }) {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState('');
//   const [userOtp, setUserOtp] = useState('');
//   const [name, setName] = useState('');

//   const handleSendOtp = async () => {
//     if (!email) return alert('Please enter your email');

//     try {
//       const response = await axios.post(
//         'http://localhost:5500/api/auth/send-otp',
//         { email },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//         }
//       );

//       console.log('OTP sent response:', response.data);
//       alert('OTP sent to your email ✅');
//       setStep(2);
//     } catch (err) {
//       console.error('Error sending OTP:', err.response?.data || err.message);
//       alert('Failed to send OTP ❌');
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!userOtp) return alert('Please enter OTP');

//     try {
//       const res = await axios.post('http://localhost:5500/api/auth/verify-otp', {
//         email,
//         otp: userOtp,
//       });

//       const token = res.data.token;
//       if (token) {
//         localStorage.setItem('token', token);         // ✅ Save token
//         localStorage.setItem('email', email);         // ✅ Save user email
//         alert('OTP Verified ✅');
//         setStep(3);
//       } else {
//         alert('Invalid OTP or token missing ❌');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('OTP verification failed ❌');
//     }
//   };

//   const handleSubmit = async () => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       return alert('No token found. Please verify OTP again.');
//     }

//     try {
//       await axios.post(
//         'http://localhost:5500/api/user/create-user',
//         { name },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert(`Account created for ${name} 🎉`);
//       setIsCreateAccount(true); // 👉 Redirect to ChatNavigator
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create user ❌');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl bg-white space-y-6">
//       <h2 className="text-2xl font-bold text-center text-blue-600">Create Account</h2>

//       {step === 1 && (
//         <div className="space-y-4">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleSendOtp}
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//           >
//             Send OTP
//           </button>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={userOtp}
//             onChange={(e) => setUserOtp(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//           <button
//             onClick={handleVerifyOtp}
//             className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
//           >
//             Verify OTP
//           </button>
//         </div>
//       )}

//       {step === 3 && (
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Enter your name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreateAccount;


// src/component/auth/CreateAccount.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userOtp, setUserOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Send OTP to email
  const sendOtp = async () => {
    try {
      const response = await axios.post(
        "https://chat-be-v2eh.onrender.com/api/auth/send-otp",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP");
    }
  };

  // Verify the OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post("https://chat-be-v2eh.onrender.com/api/auth/verify-otp", {
        email,
        otp: userOtp,
      });

      const token = res.data.token;
      localStorage.setItem("chat_token", token); // store token
      setIsOtpVerified(true);
      alert("OTP verified!");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid OTP");
    }
  };

  // Create the user
  const createUser = async () => {
    try {
      const token = localStorage.getItem("chat_token");
      const res = await axios.post(
        "https://chat-be-v2eh.onrender.com/api/user/create-user",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("chat_user", JSON.stringify(res.data.user));
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("User creation failed:", error);
      alert("Failed to create account");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      {/* Step 1: Email */}
      {!otpSent && (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
          />
          <button
            onClick={sendOtp}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {/* Step 2: OTP */}
      {otpSent && !isOtpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={userOtp}
            onChange={(e) => setUserOtp(e.target.value)}
            className="w-full p-2 border mb-4 rounded mt-4"
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* Step 3: Name and Create Account */}
      {isOtpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border mb-4 rounded mt-4"
          />
          <button
            onClick={createUser}
            className="w-full bg-purple-500 text-white p-2 rounded"
          >
            Create Account
          </button>
        </>
      )}
    </div>
  );
};

export default CreateAccount;

