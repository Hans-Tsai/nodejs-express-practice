import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotifyWhenInSeason({ sku }) {
  const [registeredEmail, setRegisteredEmail] = useState(null)
  const [email, setEmail] = useState('')
  function onSubmit(event) {
    fetch(`/api/vacation/${sku}/notify-when-in-season`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => {
        if(res.status < 200 || res.status > 299)
          return alert('We had a problem processing this...please try again.')
        setRegisteredEmail(email)
      })
    event.preventDefault()
  }
  if(registeredEmail) return (
    <i>You will be notified at {registeredEmail} when
    this vacation is back in season!</i>
  )
  return (
    <form onSubmit={onSubmit}>
      <i>Notify me when this vacation is in season:</i>
      <input
        type="email"
        placeholder="(your email)"
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        />
      <button type="submit">OK</button>
    </form>
  )
}

function Vacation({ vacation }) {
  return (
    <div key={vacation.sku}>
      <h3>{vacation.name}</h3>
      <p>{vacation.description}</p>
      <span className="price">{vacation.price}</span>
      {!vacation.season && 
        <div>
          <p><i>This vacation is not currently in season.</i></p>
          <NotifyWhenInSeason sky={vacation.sku}/>
        </div>
      }
    </div>
  )
};


function Vacations() {
  // 設定狀態
  const [ vacations, setVacations ] = useState([]);
  // 抓取初始資料
  useEffect(() => {
    fetch('/api/vacations')
      .then(res => res.json)
      .then(setVacations);
  }, []);

  return (
    <>
    <h2>Vacations</h2>
    <div className="vacations">
      {vacations.map(vacation => 
        <div key={vacation.sku}>
          <h3>{vacation.name}</h3>
          <p>{vacation.description}</p>
          <span className="price">{vacation.price}</span>
          </div>
          )}
    </div>
    </>
  )
};

export default Vacations;