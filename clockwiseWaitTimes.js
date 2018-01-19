function beginWaitTimeQuerying(waitFetchObjects, timeBetweenUpdates) {
  var TIME_BETWEEN_UPDATES = timeBetweenUpdates || 60000; // One minute in milliseconds

  // This is a helper function that looks at the returned JSON from our
  // API call and pulls the desired value from the correct key based on
  // which timeType was passed
  function rawWaitValue(timeType, data) {
    if(timeType === 'hospitalWait') return data.hospital_waits.current_wait;
    if(timeType === 'hospitalPatientsInLine') return data.hospital_waits.queue_length;
    if(timeType === 'hospitalTotalPatients') return data.hospital_waits.queue_total;
    if(timeType === 'queueWait') return determineQueueTimeToAdd(waitFetchObject, data).current_wait;
    if(timeType === 'queuePatientsInLine') return determineQueueTimeToAdd(waitFetchObject, data).current_patients_in_line;
    if(timeType === 'queueWaitRange') return determineQueueTimeToAdd(waitFetchObject, data).current_wait_range;
    return 'Invalid timeType';
  }

  // This is a helper function that pulls the correct value from the returned
  // data and delegates further formatting to a custom callback if necessary.
  function determineTimeToAdd(waitFetchObject, data) {
    var callbackFn = waitFetchObject.formatFunction;
    var rawValue = rawWaitValue(waitFetchObject.timeType, data)
    if (typeof callbackFn !== 'function') { return rawValue }
    return callbackFn(rawValue)
  }

  // This is a helper function that finds the desired queue to grab wait
  // information from
  function determineQueueTimeToAdd(waitFetchObject, data) {
    var numberOfQueues = data.appointment_queues.length;
    for(var k = 0; k < numberOfQueues; k++) {
      if(data.appointment_queues[k].queue_id === waitFetchObject.queueId) {
        return data.appointment_queues[k].queue_waits;
      }
    }
    return { current_wait:             'Queue Not Found',
             current_patients_in_line: 'Queue Not Found',
             current_wait_range:       'Queue Not Found' };
  }

  // This function is where we actually assign the wait value to the
  // selected location
  function assignWaitTime(waitFetchCluster) {
    return function(data) {
      var timeToAdd;
      for(var j = 0; j < waitFetchCluster.length; j++) {
        timeToAdd = determineTimeToAdd(waitFetchCluster[j], data);
        $(waitFetchCluster[j].selector).html(timeToAdd);
      }
    }
  }

  // This function groups waitObjects that have the same hospitalId
  // so that we can save network calls by only querying the hospital
  // once
  function clusterLikeWaits(waitObjects) {
    var groupedWaits = {},
        numberOfWaits = waitObjects.length,
        cacheKey, currentObject;
    for(var i = 0; i < numberOfWaits; i++) {
      currentObject = waitObjects[i];
      cacheKey = currentObject.hospitalId;
      if(groupedWaits[cacheKey] === undefined) { groupedWaits[cacheKey] = [currentObject] }
      else { groupedWaits[cacheKey].push(currentObject); }
    }
    return groupedWaits;
  }

  // This function is where we actually query Clockwise. For more
  // information regarding the queryUrl, check out our documentation
  // page at www.clockwisemd.com/docs (this will require an authenticated user)
  function fetchAndAssignWaitTime(clusteredWaits) {
    var waitKeys = Object.keys(clusteredWaits),
        currentCluster, queryUrl;
    for(var i = 0; i < waitKeys.length; i++) {
      currentCluster = clusteredWaits[waitKeys[i]];
      queryUrl = 'https://api.clockwisemd.com/v1/hospitals/' + waitKeys[i] + '/waits';
      $.ajax({
        url:    queryUrl,
        method: 'GET',
        success: assignWaitTime(currentCluster)
      });
    }
  }

  var clusteredWaits = clusterLikeWaits(waitFetchObjects);

  fetchAndAssignWaitTime(clusteredWaits);
  setInterval(function() { fetchAndAssignWaitTime(clusteredWaits) }, TIME_BETWEEN_UPDATES);
}
