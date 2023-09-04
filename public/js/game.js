class game {
    hide = () => {
        let items = document.getElementsByClassName('step');
        for (let item of items) {
            item.hidden = true;
        }
    }

    step = (type) => {
        hide();
        switch (type) {
            case 'init': {
                document.getElementById("init").style.hidden = false;
                break;
            }
            case 'ready': {
                document.getElementById("ready").style.hidden = false;
                break;
            }
            case 'select': {
                document.getElementById("timer").style.hidden = false;
                document.getElementById("select").style.hidden = false;
                break;
            }
            case 'end': {
                document.getElementById("end").style.hidden = false;
                break;
            }
        }
    }
}