import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, Sprite, Text, useTick } from '@pixi/react'
import { TPoint } from '../../../../lib/types'
import { distancePointToPoint, pointToIndex } from '../../utils'
import config from '../../../config.json'
import { TextStyle } from 'pixi.js'
import GameStateContext from '../../GameStateContext'

const Player = () => {
  const [position, setPosition] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0
  })

  const [isMovingUp, setIsMovingUp] = useState<boolean>(false)
  const [isMovingLeft, setIsMovingLeft] = useState<boolean>(false)
  const [isMovingDown, setIsMovingDown] = useState<boolean>(false)
  const [isMovingRight, setIsMovingRight] = useState<boolean>(false)

  const gameState = useContext(GameStateContext)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return // not interested in duplicate events

    if (e.key === 'w' || e.key === 'ArrowUp') return setIsMovingUp(true)
    if (e.key === 'a' || e.key === 'ArrowLeft') return setIsMovingLeft(true)
    if (e.key === 's' || e.key === 'ArrowDown') return setIsMovingDown(true)
    if (e.key === 'd' || e.key === 'ArrowRight') return setIsMovingRight(true)
    if (e.key === ' ') {
      console.log('bomb!')
      return
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    console.log('add evt key')

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'w' || e.key === 'ArrowUp') return setIsMovingUp(false)
    if (e.key === 'a' || e.key === 'ArrowLeft') return setIsMovingLeft(false)
    if (e.key === 's' || e.key === 'ArrowDown') return setIsMovingDown(false)
    if (e.key === 'd' || e.key === 'ArrowRight') return setIsMovingRight(false)
  }, [])

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)

    return () => document.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  useTick((delta, ticker) => {
    const velocity: TPoint = { x: 0, y: 0 }

    if (isMovingUp) velocity.y += -1
    if (isMovingLeft) velocity.x += -1
    if (isMovingDown) velocity.y += 1
    if (isMovingRight) velocity.x += 1

    if (velocity.x !== 0 || velocity.y !== 0) {
      setPosition((prevState) => {
        const justOverTheEdge = 0.0000001
        let targets: Array<{ point: TPoint, velocity: TPoint }> = []

        if (velocity.y !== 0) {
          targets.push({
            point: {
              x: Math.round(prevState.x),
              y: Math.round(prevState.y + velocity.y)
            },
            velocity: { x: 0, y: velocity.y }
          })
        }

        if (velocity.x !== 0) {
          targets.push({
            point: {
              x: Math.round(prevState.x + velocity.x),
              y: Math.round(prevState.y)
            },
            velocity: { x: velocity.x, y: 0 }
          })
        }


        // sort for the closest target
        targets.sort((a, b) => {
          return distancePointToPoint(prevState, a.point) - distancePointToPoint(prevState, b.point)
        })

        // todo: move collision logic out of here
        // find the closest walkable block
        const targetBlockFind = targets.find((target) => {
          // center of the direction the player is going
          const centerBlockDirection = {
            x: prevState.x + target.velocity.x * (0.5 + justOverTheEdge),
            y: prevState.y + target.velocity.y * (0.5 + justOverTheEdge)
          }

          let collisionPoints = [centerBlockDirection]

          if (target.velocity.x === 0) {
            collisionPoints.push({
              x: centerBlockDirection.x + (0.5 - config.movement_collision_margin),
              y: centerBlockDirection.y,
            })
            collisionPoints.push({
              x: centerBlockDirection.x - (0.5 - config.movement_collision_margin),
              y: centerBlockDirection.y,
            })
          } else if (target.velocity.y === 0) {
            collisionPoints.push({
              x: centerBlockDirection.x,
              y: centerBlockDirection.y + (0.5 - config.movement_collision_margin),
            })
            collisionPoints.push({
              x: centerBlockDirection.x,
              y: centerBlockDirection.y - (0.5 - config.movement_collision_margin),
            })
          }

          const result = collisionPoints.find((point) => {
            // can't move if anything other than 'false' (free path) shows up
            return gameState?.grid[pointToIndex(point)] !== false
          })

          return result === undefined
        })

        const speedMod = 1

        // prevent state spam
        if (!targetBlockFind) {
          return prevState
        } else {
          return {
            x: targetBlockFind.velocity.y !== 0
              ? Math.round(prevState.x)
              : prevState.x + ((targetBlockFind.velocity.x * speedMod * config.movement_speed) * delta),
            y: targetBlockFind.velocity.x !== 0
              ? Math.round(prevState.y)
              : prevState.y + ((targetBlockFind.velocity.y * speedMod * config.movement_speed) * delta)
          }
        }
      })
    }
  })

  let rotation = 0
  // todo: calculate rotation

  return (
    <Container x={position.x * config.graphics.block_size_px + config.graphics.block_size_px / 2}
               y={position.y * config.graphics.block_size_px + config.graphics.block_size_px / 2}>
      <Text text={`Player 1 ${position.x} ${position.y}`} y={-config.graphics.block_size_px * 0.6}
            anchor={{ x: 0.5, y: 0.5 }} style={
        new TextStyle({
          fontSize: 14,
          stroke: '#ffffff',
          strokeThickness: 3,
        })
      }/>
      <Sprite
        image="https://minecraft.wiki/images/EntitySprite_leatherworker.png?05433"
        height={config.graphics.block_size_px * 0.8}
        width={config.graphics.block_size_px * 0.8}
        anchor={{ x: 0.5, y: 0.5 }}
        angle={rotation}
      />
    </Container>
  )
}

export default Player
