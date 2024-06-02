import React from 'react'
import { TPlayerUsername } from '~/types/packets.ts'

const PlayerList = ({ children }: { children: React.ReactNode }) => {
  return <ul style={{
    listStyleType: 'decimal-leading-zero',
  }}>{children}</ul>
}

type TPlayerListItemProps = {
  self: boolean,
  player: TPlayerUsername,
  invite: (username: TPlayerUsername) => void,
  cancelInvite: (username: TPlayerUsername) => void,
  invited: boolean,
  inviting: boolean,
}
export const PlayerListItem = ({ self, player, invite, cancelInvite, invited, inviting }: TPlayerListItemProps) => {
  if (self)
    return <li>{player} <b>(you)</b></li>

  return <li>
    {player}{` `}
    {!invited && !inviting && <button onClick={() => invite(player)}>invite to game</button>}
    {invited && <button onClick={() => cancelInvite(player)}>cancel invite</button>}
    {inviting && <button onClick={() => invite(player)}>accept invite</button>}
  </li>
}

export default PlayerList
