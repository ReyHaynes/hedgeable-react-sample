export const FourZeroFour = ({ location }) => (
    <div id="app" className="four-zero-four">
        <h2>Route not found!</h2>
        <p>
            Cannot find content for: <code>{location.pathname}</code><br/>
            How'd you get here?! 🤔
        </p>
    </div>
)
