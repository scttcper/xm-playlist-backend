import React from 'react';

import { Channel } from 'frontend/channels';

export const StationHeader: React.FC<{ channel: Channel }> = props => {
  return (
    <div className="media my-2">
      <div className="bg-dark rounded-lg mr-3 p-2" style={{ maxWidth: '140px' }}>
        <img
          src={`/static/img/${props.channel.deeplink}-lg.png`}
          className="img-fluid"
          alt="..."
        />
      </div>
      <div className="media-body align-self-center">
        <h2 className="mt-0 mb-1">{props.channel.name}</h2>
        <p>{props.channel.desc}</p>
      </div>
    </div>
  );
};
