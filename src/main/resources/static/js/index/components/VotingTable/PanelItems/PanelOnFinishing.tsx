import PanelContainer from "./PanelContainer";

const PanelOnFinishing = () => {
    return (
        <PanelContainer>
            <button className='btn btn-outline-danger w-100'> 결과를 집계할 동안 잠시만 기다려주세요.</button>
        </PanelContainer>
    );
}

export default PanelOnFinishing;