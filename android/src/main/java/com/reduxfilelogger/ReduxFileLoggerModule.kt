package com.reduxfilelogger
import android.util.Log
import com.facebook.react.bridge.*
import com.reduxfilelogger.utils.Compressor
import com.reduxfilelogger.utils.FileCreator
import com.reduxfilelogger.utils.LogcatLogger
import com.reduxfilelogger.utils.withPromise

class ReduxFileLoggerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val loggers: MutableMap<String, LogcatLogger> = HashMap()
  private val supportedDirs =
    mapOf("Files" to reactContext.filesDir, "Cache" to reactContext.cacheDir)

  override fun getName(): String {
    return "ReduxFileLogger"
  }

  @ReactMethod
  fun addLogger(tag: String, rawFileConfig: ReadableMap, promise: Promise) {
    withPromise(promise) {
      val logger = LogcatLogger(tag, rawFileConfig, this.supportedDirs)
      logger.redirectLogcatToNewFile()
      loggers[tag] = logger
      return@withPromise null
    }
  }

  @ReactMethod
  fun archive(rawFileConfig: ReadableMap, tag: String?, promise: Promise) {
    withPromise(promise) {
      val zipFile = FileCreator(rawFileConfig, this.supportedDirs).create()
      val compressor = Compressor(zipFile)

      var archivingLoggers: MutableMap<String, LogcatLogger> = this.loggers
      if (tag != null) {
        val logger = this.loggers[tag]
        if (logger != null) {
          archivingLoggers = hashMapOf(tag to logger)
        } else {
          throw LoggerNotFoundError(tag)
        }
      }

      compressor.zip(archivingLoggers.values.map { logger -> logger.logFile })
      archivingLoggers.values.forEach { logger -> logger.redirectLogcatToNewFile() }
      Log.i("ReduxFileLoggerModule", zipFile.path)
      return@withPromise zipFile.path
    }
  }

  @ReactMethod
  fun log(tag: String, message: String) {
    loggers[tag]?.log(message)
  }
}
