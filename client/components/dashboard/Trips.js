import { Feed, Icon } from 'semantic-ui-react';
import moment from 'moment';

export default ({ trips }) => {
  const Event = ({ trip }) => {
    let icon = 'bus';

    if (trip.location.includes('STATION')) {
      icon = 'subway';
    }
    return (
      <Feed.Event>
        <Feed.Label>
          <Icon name={icon} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>{trip.location}</Feed.Summary>
          <Feed.Meta>
            <Feed.Date>{moment(trip.date).fromNow()}</Feed.Date>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  };

  return (
    <>
      <h2>Trip Summary</h2>
      <Feed>
        {trips.map(trip => (
          <Event trip={trip} />
        ))}
      </Feed>
    </>
  );
};
