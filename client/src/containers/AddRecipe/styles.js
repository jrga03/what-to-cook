import styled from 'styled-components';

export const Container = styled.main`
width: 100vw;
max-width: 960px;
display: flex;
flex-direction: column;
align-items: center;
padding-bottom: 50px;

.button-container {
    display: flex;
    width: 100%;
    justify-content: flex-end;

    button {
        margin-top: 10px;
        margin-right: 25px;
    }
}
`;

export const TextFieldWrapper = styled.div`
width: calc( 100% - 2rem);
box-sizing: border-box;

h6 {
    color: rgba( 0, 0, 0, 0.54 );
    font-size: 16px;
}

.multiselect {
    margin-top: 16px;
    margin-bottom: 8px;
}
`;

export const EditorWrapper = styled.div`
width: calc( 100% - 2rem);
box-sizing: border-box;
border: 1px solid #999;
border-radius: 10px;
padding: 1rem 0.5rem;

.toolbar-controls, .DraftEditor-root {
    width: 100%;
}

.DraftEditor-root {
    min-height: 50vh;

    .public-DraftEditor-content {
        min-height: 50vh;
    }
}

.RichEditor-blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-weight: bold;
    margin: 16px 0;
    padding: 10px 20px;
}

.toolbar-controls {
    margin-left: 10px;
}

.action-controls {
    margin-bottom: 10px;
}

.block-type-container {
    display: flex;
    flex-wrap: wrap;

    & > div {
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
`;