# wec-front-core

## api

WecCore
- constructor(setting, cache, apiRequest)
- sync
    - getCurrentCompanyCode()
    - getMainAppCode()
    - getCurrentAppCode()
- async
    - call(appCode, api, params)
    - post(appCode, pi, params)
    - asGetAuthUrl(oauthOpts)
    - asEnterCompany(companyCode)
    - asIsLogined()
    - asAccessWeb(accessToken)
    - asTokenCompany(companyCode)
    - asTokenCompanyByCode(companyCode, code, state)
    - asGetAppSetting(appCode)
    - asGetCurrentCompany()
    - asLogout()


* All the async function prefix with 'as' except 'call' and 'post'
