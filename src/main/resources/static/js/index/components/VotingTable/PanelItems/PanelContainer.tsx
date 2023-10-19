import "./PanelContainer.css"

type props = {
    children: React.ReactNode
}

const PanelContainer = (props: props) => {

    return (
        <div className='row mt-3 p-3'>
            {props.children}
        </div>
    )
        ;
}

export default PanelContainer;