import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotifyWhenInSeason({ sku }) {
  return (
    <>
    <i>Notify me when this vacation is in season:</i>
      <input type="email" placeholder="(your email)" />
      <button>OK</button>
    </>
  )
};

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