import "../../Styles/Ui.css"

function Loading({ margin }) {

    if (margin) {
        return (
            <div className="page-loader loading-margin">
                <div className="spinner" />
                <br />
                <p>Loading ...</p>
                {/* <p className="muted">
                    First load may be slow because the server is on a free tier.
                </p> */}
            </div>
        )
    }
    return (
        <div className="page-loader">
            <div className="spinner" />
            <br />
            <p>Loading ...</p>
            {/* <p className="muted">
                    First load may be slow because the server is on a free tier.
                </p> */}
        </div>
    )
}

export default Loading