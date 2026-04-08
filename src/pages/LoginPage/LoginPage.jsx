import './LoginPage.css'

export function LoginPage({ requestLogin }) {
  return (
    <div className='login-page app-fullscreen' dir='rtl'>
      <p className='app-auth-label'>Recipes</p>
      <div className='login-page__footer-actions'>
        <button
          type='button'
          onClick={() => requestLogin()}
          className='login-page__btn-primary'
        >
          התחבר עם Google
        </button>
        <a
          href={`${import.meta.env.BASE_URL}privacy.html`}
          target='_blank'
          rel='noopener noreferrer'
          className='app-link-muted'
        >
          Privacy policy (English)
        </a>
      </div>
    </div>
  )
}
