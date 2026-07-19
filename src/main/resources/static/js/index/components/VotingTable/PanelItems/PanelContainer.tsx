import "./PanelContainer.css"

type props = {
    children: React.ReactNode
}

const PanelContainer = (props: props) => {

    return (
        <div className='votePanelContainer card'>
            {props.children}
        </div>
    )
        ;
}

export default PanelContainer;
