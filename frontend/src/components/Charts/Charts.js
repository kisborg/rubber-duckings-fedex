import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line, Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { fetchCommitmentsAsync } from '../../redux/commitments/commitments.actions';
import { getUsersAsync } from '../../redux/users/users.actions';
import './Charts.css';

function Charts() {
  const dispatch = useDispatch();
  const commitments = useSelector((state) => state.commitments.commitments);
  const userId = useSelector((state) => state.user.userId);
  const challenge = useSelector((state) => state.challenge.challenge);
  const [datesLabel, setDatesLabel] = useState([]);
  const { users } = useSelector((state) => state.users);
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [selectedUserIds, setSelectedUserIds] = useState([userId]);
  const machineDate = useSelector((state) => state.currentDate.currentDate);

  useEffect(() => {
    dispatch(fetchCommitmentsAsync());
    dispatch(getUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    (function setChartDates() {
      const dateArray = [];
      let currentDate = dayjs(challenge.startDate);
      const stopDate = dayjs(challenge.endDate);
      while (currentDate <= stopDate) {
        dateArray.push(dayjs(currentDate).format('YYYY-MM-DD'));
        currentDate = dayjs(currentDate).add(1, 'd');
      }
      setDatesLabel(dateArray);
    }());
  }, []);

  const remaining = commitments
    .filter((comm) => comm.userId === selectedUserId)
    .filter((commitment) => commitment.endDate >= dayjs(machineDate).format())
    .length;
  const missed = commitments
    .filter((comm) => comm.userId === selectedUserId)
    .filter(
      (commitment) => commitment.endDate < dayjs(machineDate).format()
        && commitment.isDone === false,
    ).length;
  const completed = commitments
    .filter((comm) => comm.userId === selectedUserId)
    .filter((commitment) => commitment.isDone === true).length;

  const completedPerDay = datesLabel.map((date) => {
    const dailyComms = commitments
      .filter((comm) => comm.userId === selectedUserId)
      .filter((comm) => comm.endDate <= date);
    const percent = (dailyComms.filter((comm) => comm.isDone === true).length
        / dailyComms.length)
      * 100;
    return percent;
  });

  const totalCompletedPerDay = datesLabel.map((date) => {
    const dailyComms = commitments
      .filter((comm) => comm.endDate <= date);
    const percent = (dailyComms.filter((comm) => comm.isDone === true).length
        / dailyComms.length)
      * 100;
    return percent;
  });

  const handelUserSelection = (event) => {
    const { id } = users.filter((user) => user.username === event.target.value)[0];
    setSelectedUserId(id);
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((userid) => userid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };
  console.log(selectedUserIds);

  const userSelectButtons = users.map((user) => (
    <div className="user" key={user.username}>
      <input
        type="checkbox"
        id={user.username}
        name="user"
        value={user.username}
        onChange={handelUserSelection}
        defaultChecked={user.id === userId}
      />
      <label htmlFor={user.username}>{user.username}</label>
    </div>
  ));

  return (
    <section className="charts-main-container">
      <div className="form-wrapper">
        <form className="user-select-form">{userSelectButtons}</form>
      </div>
      <div className="charts-wrapper">
        <div className="charts-container">
          <Line
            data={{
              labels: datesLabel,
              datasets: [
                {
                  label: 'User Completition percentage',
                  data: completedPerDay,
                  borderColor: '#86c232',
                  fill: false,
                },
                {
                  label: 'Total Completition percentage',
                  data: totalCompletedPerDay,
                  borderColor: 'rgba(191, 188, 8)',
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      suggestedMin: 0,
                      suggestedMax: 100,
                    },
                  },
                ],
              },
            }}
          />
        </div>
        <div className="charts-container">
          <Pie
            data={{
              datasets: [
                {
                  label: 'Completition percentage',
                  data: [completed, remaining, missed],
                  backgroundColor: [
                    '#86c2327b',
                    'rgba(144, 144, 144, 0.2)',
                    'rgba(255, 30, 30, 0.4)',
                  ],
                },
              ],
              labels: ['Done', 'Remaining', 'Missed'],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </section>
  );
}

export default Charts;
