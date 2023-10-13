import "./Gourmet.css"

type props = {
    isActive: boolean
}

const Gourmet = (props: props) => {
    return (
        <div className='gourmet d-inline m-1'>
            {props.isActive && <div className='gourmet-img active'></div>}
            {!props.isActive && <div className='gourmet-img'></div>}
            <div className='vote-light'></div>
            <div className='noName text-center'>mr</div>
        </div>
    );
}

export default Gourmet;

