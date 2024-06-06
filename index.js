import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { redirect } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import CodeToSend from './VMS/Codetosend';
import Backup from './VMS/Backup';
import Recordings from './VMS/Recordings';
import AddCamera from './VMS/AddCamera';
import LiveStream from './VMS/LiveStream';
import PlayRecordings from './VMS/PlayRecordings';
import India from './VidsMap/India';
import Users from './UserRoles/Users';
import Roles from './UserRoles/Roles';
import Usersedit from './UserRoles/Usersedit';
import EnterVids from './VidsMap/EnterVids';
import UserRights from './UserRoles/UserRights';
import NewUser from './UserRoles/NewUser';
import VidsList from './VidsMap/VidsList';
import VidsEdit from './VidsMap/VidsEdit';
import ChartsPage from './Charts/ChartsPage'
import BarsChart from './Charts/BarsChart';
import Incident from './VidsMap/Incident';
import ReactVideoPlayer from './VidsMap/ReactVideoPlayer';
import Heatmap from './VidsMap/Heatmap';
import VIDS from './VIDSconf/VIDS';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute'
import Replay from './VMS/Replay';
import WebSckTest from './VIDSconf/WebSckTest';
import GroupsList from './VMS/GroupsList';
import AddGroup from './VMS/AddGroup';
import RoadCondition from './RCM/RoadCondition';
import NewLiveStream from './VMS/NewLiveStream';
import Liscense from './Components/Liscense';
import Ptz from './VMS/PtzControl';
import NewReplay from './VMS/NewReplay';
import VidsLive from './VIDSconf/VidsLive';
import Testing from './VMS/Testing';
import Test from './VMS/Test2';
import LLLive from './VMS/LLlivestream';
import SnapClips from './VMS/SnapClips';


const router = createBrowserRouter([
  {
    path: 'Liscense',
    element: <Liscense />,
  },
  {
    path: 'NewLiveStream',
    element: <NewLiveStream />,
  },
  {
    path: "RoadCond",
    element: <RoadCondition />,
  },
  {
    path: "AddGroup",
    element: <AddGroup />,
  },
  {
    path: "/GroupsList",
    element: <GroupsList />,
  },
  {
    path: "Websck",
    element: <WebSckTest />,
  },
  {
    path: "/",

    element: <App />,
  },
  {
    path: "/AddCamera",

    element: <AddCamera />,
  },
  {
    path: '/LiveStream',

    element: <LiveStream />,
  },
  {
    path: '/Recordings',

    element: <Recordings />,
  },
  {
    path: '/PlayRecordings',

    element: <PlayRecordings />
  },
  {
    path: "/India",

    element: <India />,
  },
  {
    path: "/Users",

    element: <Users />,
  },
  {
    path: "/Roles",

    element: <Roles />,
  },
  {
    path: "/Usersedit",

    element: <Usersedit />,
  },
  {
    path: "/EnterVids",

    element: <EnterVids />,
  },
  {
    path: "/UserRights",

    element: <UserRights />,
  },
  {
    path: "/NewUser",

    element: <NewUser />,
  },
  {
    path: "/VidsList",

    element: <VidsList />,
  },
  {
    path: "/VidsEdit",

    element: <VidsEdit />,
  },
  {
    path: "/ChartsPage",

    element: <ChartsPage />,
  },
  {
    path: "/BarsChart",

    element: <BarsChart />,
  },
  {
    path: "/Incident",

    element: <Incident />,
  },
  {
    path: "/ReactVideoPlayer",

    element: <ReactVideoPlayer />
  },
  {
    path: "/Heatmap",

    element: <Heatmap />
  },
  {
    path: "/VIDS",

    element: <VIDS />
  },
  {
    path: "/Login",
    element: <Login />
  },
  {
    path: "/Ptz",
    element: <Ptz />
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={'/'}>
    <Routes>
      <Route path="/Liscense" element={
        <Liscense />
      } />
      {/* <Route path='/Codetosend' element={<CodeToSend />} /> */}
      <Route path='/Login' element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      } />
      <Route path="/VIDS" element={
        <ProtectedRoute>
          <VIDS />
        </ProtectedRoute>

      } />
      <Route path="/Heatmap" element={
        <ProtectedRoute>
          <Heatmap />
        </ProtectedRoute>
      } />
      <Route path="/ReactVideoPlayer" element={
        <ProtectedRoute>
          <ReactVideoPlayer />
        </ProtectedRoute>
      } />
      <Route path="/Replay" element={
        <ProtectedRoute>
          <Replay />
        </ProtectedRoute>
      } />
      <Route path="/Incident" element={
        <ProtectedRoute>
          <Incident />
        </ProtectedRoute>
      } />
      <Route path="/BarsChart" element={
        <ProtectedRoute>
          <BarsChart />
        </ProtectedRoute>
      } />
      <Route path="/ChartsPage" element={
        <ProtectedRoute>
          <ChartsPage />
        </ProtectedRoute>
      } />
      <Route path="/VidsEdit" element={
        <ProtectedRoute>
          <VidsEdit />
        </ProtectedRoute>
      } />
      <Route path="/VidsList" element={
        <ProtectedRoute>
          <VidsList />
        </ProtectedRoute>
      } />
      <Route path="/NewUser" element={
        <ProtectedRoute>
          <NewUser />
        </ProtectedRoute>
      } />
      <Route path="/UserRights" element={
        <ProtectedRoute>
          <UserRights />
        </ProtectedRoute>
      } />
      <Route path="/EnterVids" element={
        <ProtectedRoute>
          <EnterVids />
        </ProtectedRoute>
      } />
      <Route path="/Usersedit" element={
        <ProtectedRoute>
          <Usersedit />
        </ProtectedRoute>
      } />
      <Route path="/Users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/India" element={
        <ProtectedRoute>
          <India />
        </ProtectedRoute>
      } />
      <Route path="/PlayRecordings" element={
        <ProtectedRoute>
          <PlayRecordings />
        </ProtectedRoute>
      } />
      <Route path="/Recordings" element={
        <ProtectedRoute>
          <Recordings />
        </ProtectedRoute>
      } />
      <Route path="/LiveStream" element={
        <ProtectedRoute>
          <LiveStream />
        </ProtectedRoute>
      } />
      <Route path="/AddCamera" element={
        <ProtectedRoute>
          <AddCamera />
        </ProtectedRoute>
      } />
      <Route path="/Websck" element={
        <ProtectedRoute>
          <WebSckTest />
        </ProtectedRoute>

      } />
      <Route path="/TRA" component={() => {

        window.location.href = "192.168.10.128:1002/revenue_info";
        return null;
      }

      } />
      <Route path="/GroupsList" element={
        <ProtectedRoute>
          <GroupsList />
        </ProtectedRoute>
      } />
      <Route path="/AddGroup" element={
        <ProtectedRoute>
          <AddGroup />
        </ProtectedRoute>
      } />
      <Route path="/RoadCond" element={
        <ProtectedRoute>
          <RoadCondition />
        </ProtectedRoute>
      } />
      <Route path="/NewLiveStream" element={
        <ProtectedRoute>
          <NewLiveStream />
        </ProtectedRoute>
      } />
      <Route path="/Ptz" element={
        <ProtectedRoute>
          <Ptz />
        </ProtectedRoute>
      } />
      <Route path="/NewReplay" element={
        <ProtectedRoute>
          <NewReplay />
        </ProtectedRoute>
      } />
        <Route path="/Live" element={
        <ProtectedRoute>
          <LLLive />
        </ProtectedRoute>
      } />
      <Route path="/VidsLive" element={
        <ProtectedRoute>
          <VidsLive />
        </ProtectedRoute>
      } />
      <Route path="/SnapClips" element={
        <ProtectedRoute>
          <SnapClips />
        </ProtectedRoute>
      } />
      <Route path="/Testing" element={
        // <ProtectedRoute>
          <Testing />
        } />
        <Route path="/Backup" element={
        // <ProtectedRoute>
          <Backup />
        } />
        {/* </ProtectedRoute> */}

    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// {
//   path: "/",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <App />,
// },
// {
//   path: "/AddCamera",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <AddCamera />,
// },
// {
//   path:'/LiveStream',
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <LiveStream />,
// },
// {
//   path:'/Recordings',
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <Recordings />,
// },
// {
//   path:'/PlayRecordings',
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <PlayRecordings/>
// },
// {
//   path: "/India",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <India />,
// },
// {
//   path: "/Users",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <Users />,
// },
// {
//   path: "/Roles",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <Roles />,
// },
// {
//   path: "/Usersedit",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <Usersedit />,
// },
// {
//   path: "/EnterVids",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <EnterVids />,
// },
// {
//   path: "/UserRights",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <UserRights />,
// },
// {
//   path: "/NewUser",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <NewUser />,
// },
// {
//   path: "/VidsList",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <VidsList />,
// },
// {
//   path: "/VidsEdit",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <VidsEdit />,
// },
// {
//   path: "/ChartsPage",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <ChartsPage />,
// },
// {
//   path: "/BarsChart",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <BarsChart />,
// },
// {
//   path: "/Incident",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element: <Incident />,
// },
// {
//   path:"/ReactVideoPlayer",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element:<ReactVideoPlayer/>
// },
// {
//   path:"/Heatmap",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element:<Heatmap/>
// },
// {
//   path:"/VIDS",
//   loader:() => {
//     if (!isEnabled) return redirect('/Login');
//     return null;
//   },
//   element:<VIDS/>
// },
// {
//   path:"/Login",
//   element:<Login />
// },