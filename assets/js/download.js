(function() {
  /**
   * Fetch releases from github with a cache of 1 hour
   * @returns {promise<object[]>}
   */
  function fetchReleases() {
    var cacheDate = localStorage.releasesCacheDate;

    if (cacheDate && (new Date() - new Date(cacheDate)) < 1000 * 3600) {
      return $.when(JSON.parse(localStorage.releasesCache));
    }
    else {
      return $.getJSON(releasesAPI)
        .then(function(data) {
          localStorage.releasesCacheDate = new Date().toString();
          localStorage.releasesCache = JSON.stringify(data);
          return data;
        });
    }
  }

  /**
   * Adds a release to #releases
   * @param {object} release
   */
  function fillReleaseInfo(release) {
    $('#currentVersion').text('latest: ' + release.tag_name);
    $('#download-popup').attr("title", 'Download ' + siteName + " " + release.tag_name)

    $('#sourcesDownloadLink').attr("href", release.zipball_url);

    var asset;
    var i;
    for (i = 0; i < release.assets.length; i++)
    {
      asset = release.assets[i];

      if (asset.name.endsWith('bin.zip'))
      {
        $('#binariesDownloadLink').attr("href", asset.browser_download_url);
        $('#binariesDownloadCount').text('Downloaded ' + asset.download_count + ' times.');
      }
      else if (asset.name.endsWith('msi'))
      {
        $('#msiDownloadLink').attr("href", asset.browser_download_url);
        $('#msiDownloadCount').text('Downloaded ' + asset.download_count + ' times.');
      }
    }
  }

  fetchReleases()
    .then(function(releases) {
      $('#spinner').remove();

      fillReleaseInfo(releases[0]);

      if (window.location.hash && $(window.location.hash).length) {
        $(window.location.hash)[0].scrollIntoView();
      }
    });
}());
