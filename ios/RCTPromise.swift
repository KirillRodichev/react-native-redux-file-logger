import Foundation


class Promise {
    private let resolver: RCTPromiseResolveBlock
    private let rejecter: RCTPromiseRejectBlock
    
    init(resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        self.resolver = resolver
        self.rejecter = rejecter
    }

    func reject(error: RFLError, cause: NSError?) {
        rejecter(error.code, error.message, cause)
    }

    func reject(error: RFLError) {
        reject(error: error, cause: nil)
    }

    func resolve(_ value: Any?) {
        resolver(value)
    }

    func resolve() {
        resolve(nil)
    }
}

func withPromise(_ promise: Promise, _ block: () throws -> Any?) {
  do {
    let result = try block()
    promise.resolve(result)
  } catch let error as RFLError {
    promise.reject(error: error)
  } catch let error as NSError {
    promise.reject(error: RFLError.unknown(message: error.description), cause: error)
  }
}

func withPromise(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock,
    _ block: () throws -> Any?
) {
  return withPromise(Promise(resolver: resolve, rejecter: reject), block)
}
