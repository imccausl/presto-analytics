module.exports = {
  baseUrl: 'https://www.prestocard.ca/',
  loginEndpoint: 'api/sitecore/AFMSAuthentication/SignInWithAccount',
  logoutEndpoint: 'api/sitecore/AFMSAuthentication/Logout',
  dashboard: 'en/dashboard',
  homepage: 'en/',
  activityEndpoint: 'api/sitecore/Paginator/CardActivityFilteredIndex',
  switchCards:
    'api/sitecore/Global/UpdateFareMediaSession?id=lowerFareMediaId&class=lowerFareMediaId',
  cardActivity: 'en/dashboard/card-activity',
  usageReport: 'en/dashboard/transit-usage-report',
  csvEndpoint: 'api/sitecore/Paginator/TransitUsageExportCSV',
  usageEndpoint: 'api/sitecore/Paginator/TransitUsageReportFilteredIndex'
};
