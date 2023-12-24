import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import InputEmoji from "react-input-emoji"

import { useDispatch, useSelector } from 'react-redux'
import { userProfileFetch } from "../store/appSlice"  // panggil function nya

import ListMatches from '../components/ListMatches';
import Loading from '../components/Loading';

import socket from '../socket'
import ListChatUser from '../components/ListChatUser';
import NoSelectedChat from '../components/NoSelectedChat';

const Matches = () => {
  let [matchesData, setMatchesData] = useState([])
  let [loading, setLoading] = useState(true)
  let [loadingMsg, setLoadingMsg] = useState(true)

  let dispatch = useDispatch()
  let { userProfile } = useSelector((state) => state.appReducer)

  let [userChats, setUserChats] = useState([])
  let [currentChatId, setCurrentChatId] = useState(null)
  let [message, setMessage] = useState([])
  let [nameUserOnChat, setNameUserOnChat] = useState(null)
  let [profilePictureUserOnChat, setProfilePictureUserOnChat] = useState(null)
  let [idUserConversation, setIdUserConversation] = useState(null)

  let [isAddtoChatListCalled, setIsAddtoChatListCalled] = useState(false)
  let [matchId, setMatchId] = useState(null)
  let [newTextMessage, setNewTextMessage] = useState('')

  function formatterDate(value) {
    let date = new Date(value);
    let year = date.getFullYear();
    let month = `${date.getMonth() + 1}`.padStart(2, '0')
    let day = `${date.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  async function showMatches() {
    try {
      let { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + `/users/matches`,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      });
      setMatchesData(data.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  async function findChat() {
    try {
      let { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + `/chat/find`,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      });
      setUserChats(data)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      });
    } finally {
      setLoading(false)
      console.log(userChats)
    }
  }

  async function addtoChatList(idUser) {
    try {
      await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + `/chat/${idUser}`,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      })
      setIsAddtoChatListCalled(false)
      setMatchId(idUser)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      });
    }
  }

  async function currentChat(ChatId, nameUser, profilePicture, idUserOnConversation) {
    setCurrentChatId(ChatId)
    setIdUserConversation(idUserOnConversation)
    setNameUserOnChat(nameUser)
    setProfilePictureUserOnChat(profilePicture)
  }

  async function exportMessage(currentChatId) {
    try {
      setLoadingMsg(true)
      let { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + `/message/${currentChatId}`,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      })
      setMessage(data)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      });
    } finally {
      setLoadingMsg(false)
    }
  }

  async function sendMessage() {
    try {
      await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + `/message`,
        data: {
          ReceiverId: idUserConversation,
          content: newTextMessage,
          ChatId: currentChatId
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      })
      setNewTextMessage('')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      })
    }
  }

  useEffect(() => {
    if (isAddtoChatListCalled === null) {
      addtoChatList(matchId)
      setIsAddtoChatListCalled(true)
    }
  }, [isAddtoChatListCalled])

  useEffect(() => {
    if (currentChatId !== null) {
      exportMessage(currentChatId)
    }
    dispatch(userProfileFetch())
  }, [currentChatId])

  useEffect(() => {
    showMatches()
    findChat()
  }, [matchId]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section>
          <div className="m-10">
            <div className="mockup-window border bg-base-200 p-10">
              <h2 className="font-bold flex justify-center font-serif mb-7 text-2xl text-primary-500">
                Matches
              </h2>
            </div>
          </div>

          <ListMatches matchesData={matchesData} addtoChatList={addtoChatList} />

          <div className="m-10 ">
            <div className="card  lg:card-side mt-4 shadow-xl">

              <ListChatUser userChats={userChats} currentChat={currentChat} />

              {userChats.length > 0 && (
                <div className="card-body bg-base-200">
                  {currentChatId === null ? (
                    <NoSelectedChat />
                  ) : loadingMsg ? (
                    <h1 className='text-center'><span className="loading loading-bars loading-md"></span></h1>
                  ) : (
                    <div className='chat-box bg-base-secondary border '>
                      <div className='chat-header bg-base-300'>
                        <p className='text-base text-center'>{nameUserOnChat}</p>
                      </div>
                      <div className='p-4  h-[370px]'>

                        {message && message.map((msg, i) => (
                          <div key={i} className={`chat ${msg.SenderId === userProfile.id ? 'chat-end' : 'chat-start'}`}>
                            <div className="chat-image avatar">
                              <div className="w-10 rounded-full">
                                <img className='hidden sm:block' src={msg.SenderId === userProfile.id ? userProfile.UserProfile.profilePicture : profilePictureUserOnChat} />
                              </div>
                            </div>
                            <div className="chat-bubble">{msg.content}</div>
                            <div className="chat-footer opacity-50">
                              {msg.SenderId === userProfile.id && (
                                <span>Delivered </span>
                              )}
                              {formatterDate(msg.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentChatId !== null ? (
                    <InputEmoji
                      type="text"
                      value={newTextMessage}
                      onEnter={sendMessage}
                      onChange={setNewTextMessage}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Matches