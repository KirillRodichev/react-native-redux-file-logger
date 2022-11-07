package com.reduxfilelogger

abstract class RFLError(
  /**
   * The domain of the error. Error domains are used to group errors.
   *
   * Example: "permission"
   */
  val domain: String,
  /**
   * The id of the error. Errors are uniquely identified under a given domain.
   *
   * Example: "microphone-permission-denied"
   */
  val id: String,
  /**
   * A detailed error description of "what went wrong".
   *
   * Example: "The microphone permission was denied!"
   */
  message: String,
  /**
   * A throwable that caused this error.
   */
  cause: Throwable? = null
) : Throwable("[$domain/$id] $message", cause)

class LoggerNotFoundError(tag: String) : RFLError("logger", "not-found", "Logger with tag = $tag not found!")
class IncompleteFileConfigurationError : RFLError("file-configuration", "incomplete", "Incomplete file configuration provided!")

class UnknownRFLError(cause: Throwable?) : RFLError("unknown", "unknown", cause?.message ?: "An unknown camera error occurred!", cause)

