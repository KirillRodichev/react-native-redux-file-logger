package com.reduxfilelogger.utils

import com.facebook.react.bridge.Promise
import com.reduxfilelogger.RFLError
import com.reduxfilelogger.UnknownRFLError

inline fun withPromise(promise: Promise, closure: () -> Any?) {
  try {
    val result = closure()
    promise.resolve(result)
  } catch (e: Throwable) {
    e.printStackTrace()
    val error = if (e is RFLError) e else UnknownRFLError(e)
    promise.reject("${error.domain}/${error.id}", error.message, error.cause)
  }
}
