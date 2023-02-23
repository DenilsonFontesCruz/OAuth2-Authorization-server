Feature: Create User

Scenario: Create a New User
    Given: Provide valid user informations
    When: I attemp to create a new user
    Then: User should be saved and password must be encrypted
    
Scenario: Email format invalid
    Given: Provide invalid email informations
    When: I attemp to create a new user
    Then: It should return an InvalidDetails error and the user should not be saved

Scenario: Email alredy registered
    Given: Provide invalid email informations
    When: I attemp to create a new user
    Then: It should return an AlredyInUse error and the user should not be saved

Scenario: Name format invalid
    Given: Provide invalid name informations
    When: I attemp to create a new user
    Then: It should return an InvalidDetails error and the user should not be saved

Scenario: Password format invalid
    Given: Provide invalid password informations
    When: I attemp to create a new user
    Then: It should return an InvalidDetails error and the user should not be saved