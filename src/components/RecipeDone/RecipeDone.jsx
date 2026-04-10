import { useEffect } from 'react'
import { Modal } from '../Modal/Modal.jsx'
import {
  fireCelebrationConfetti,
  resetConfetti,
} from '../../utils/confettiCelebration.js'
import './RecipeDone.css'

export function RecipeDone({ onClose }) {
  useEffect(() => {
    fireCelebrationConfetti()
    return () => resetConfetti()
  }, [])

  return (
    <Modal
      onClose={onClose}
      titleId='recipe-done-title'
      panelClassName='recipe-done'
    >
      {/* <div className='recipe-done__emoji'>🎉</div> */}
      <p id='recipe-done-title' className='recipe-done__title'>
        כל הכבוד!
      </p>
      <p id='recipe-done-description' className='recipe-done__description'>
        סיימת את המתכון בהצלחה!
        <br />
        שיהיה בתיאבון!
      </p>
      <button type='button' className='recipe-done__button' onClick={onClose}>
        ביייי
      </button>
    </Modal>
  )
}
