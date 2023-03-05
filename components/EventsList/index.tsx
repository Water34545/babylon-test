import { FC } from "react";
import { utils } from "ethers";
import { TypedEvent } from "../../types/ethers-contracts/common";
import { IEventsArgs } from "../../contracts/useTestContract";

interface IEventsList {
  events: TypedEvent<any, IEventsArgs>[];
}

const EventsList: FC<IEventsList> = ({ events }) => {
  if (events) return <p>Loading events</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>from</th>
          <th>token address</th>
          <th>token id</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.transactionIndex}>
            <td>{event.args.from}</td>
            <td>{event.args.collection}</td>
            <td>{10 ** 18 * +utils.formatEther(event.args.identifier)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EventsList;
