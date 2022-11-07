import os.log
import Foundation


class OsLogLogger: NSObject {
    private let tag: String
    private var output: FileHandlerOutputStream?
    private let fileCreator: FileCreator

    public var fileUrl: URL?

    init(tag: String, rawFileConfig: [String: String]) throws {
        self.tag = tag
        self.fileCreator = try FileCreator(rawFileConfig: rawFileConfig)
    }

    func redirectOsLogToNewFile() throws -> Void {
        self.fileUrl = try self.fileCreator.create()
        let fileHandle = try FileHandle(forWritingTo: self.fileUrl!)
        self.output = FileHandlerOutputStream(fileHandle)
    }

    func log(message: String) -> Void {
        if (self.output != nil) {
            print(message, to: &self.output!)
        }
    }
}
