
const reachRangeLimit = 90.0;

const checkPlaceRange = (pointA, pointB) => {

    if (pointA.distanceTo(pointB) > reachRangeLimit) {
        return false;
    }


    return true;
}

export default checkPlaceRange;