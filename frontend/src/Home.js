import inferno from "./de_inferno_radar.png";
import {useEffect, useRef, useState} from "react";

const Home = () => {

    const [data, setData] = useState({});

    const canvasRef = useRef(null);

    useEffect(() => {
        if (Object.keys(data).length === 0)
            fetchData();
    }, [])

    useEffect(() => {
        console.log('dataupdate', data)
    }, [data])

    useEffect(() => {
        if (Object.keys(data).length > 0){
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            const image = new Image();
            image.src = inferno;

            image.onload = () => {
                // Set canvas dimensions to match image dimensions
                canvas.width = image.width;
                canvas.height = image.height;

                // Draw image onto canvas
                context.drawImage(image, 0, 0);

                context.beginPath();

                //spawnpoint

                // forloopa efter att ha dragit in fetch

                for (let i = 0; i < data.footsteps.length; i++) {
                    if (data?.footsteps[i+1]?.timelimit){
                        console.log(data.footsteps[i+2])
                        context.moveTo((data.footsteps[i+2].x -(-2087))/4.9, Math.abs(data.footsteps[i+2].y - 3870)/4.9)
                        i++;
                        continue;
                    } else {
                        context.lineTo((data.footsteps[i].x -(-2087))/4.9, Math.abs(data.footsteps[i].y - 3870)/4.9)
                    }


                }

                context.strokeStyle = 'red';
                context.lineWidth = 5;
                context.stroke();
            };
        }

    }, [data]);

    const fetchData = async () => {
        console.log('in fetch')
        const res = await fetch('http://localhost:3001/')
        const json = await res.json();
        setData(json);
    }

    return <canvas ref={canvasRef}/>;
}

export default Home;
