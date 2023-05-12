import React from 'react';
import { Flipper } from "react-flip-toolkit";
import { Group } from '../../../models/models';
import GroupCard from '../group-card/GroupCard';
import './GroupList.scss';

interface GroupListProps {
  groups: Group[],
  subcategoryId: string,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
}

const GroupList = ({ groups, subcategoryId, setSuccessMessage }: GroupListProps): JSX.Element => {
  return (
    <Flipper
      flipKey={groups.length}
      className="group-list"
      spring="verygentle"
      decisionData={groups.length}
      staggerConfig={{
        card: {
          reverse: groups.length > 0,
          speed: 0.5
        }
      }}
    >
      <h2 className="group-list__heading">Group List</h2>
      {
        groups.length
        ? <ul className="group-list__list">
            {
              groups.map((group: Group, index: number) => (
                <li key={group.id}>
                  <GroupCard
                    group={group}
                    number={index+1}
                    subcategoryId={subcategoryId}
                    setSuccessMessage={setSuccessMessage}
                  />
                </li>
              ))
            }
          </ul>
        : <p>No groups have been added yet.</p>
      }
    </Flipper>
  )
}

export default GroupList;
